---
title: "【日誌】自動場景植被生成"
date: 2023-02-27
# lastmod: 2023-03-01

draft: true

description:
tags: [procedure-generation]

socialshare: true

## image for preview
# feature: "/post/about-learning/featured.jpg"

## image for open graph
# og: "/post/about-learning/featured.jpg"

## when calling "resources" shortcode, well link to static folder with this path 
feature: "/devlog/technical/surface-scatter-2/featured.jpg"

## customize page background
# background: [watercolor-A] 

## listout with recommand, new and all pages
# listable: [recommand, all]
---

本篇內容是[【日誌】沿著表面隨機生成]({{< ref "devlog/technical/surface-scatter-1.md" >}})的後續，添加更多實用的生成屬性，更據地形生成不同的植被。

<!--more-->

## 更進一步

基本的生成算法完成後，接著就是開始往真實應用思考需求，將各種可能的功能進行整合，讓系統更好使用。  

### 成果展示 +

樹木，調整生成範圍和允許的地形，不會在陡坡、水底與山頂生成。

{{< resources/image "result-tree.gif" >}}

水草，只能夠在水面高度一下的位置生成。

{{< resources/image "result-aquatic.gif" >}}

花海，只能在山脈的頂峰生長。

{{< resources/image "result-flower.gif" >}}

### 儲存設定 -

我第一個想到的是重複使用性，

以生成規則來說，通常一個植物（或東西）自然出現的條件是固定的，水草只會長在水底下、樹木沿著山壁生長，而高原風大寒冷，只有灌木花草等草本植物

因此我們能將生成「設定」與生成「物體」分開處存，如此的好處是能將設定重複使用

相似的植物不需要 重複調整生成條件 設定出一個高原植物的設定，給所有合適的物件共用

將生成參數移到 ScriptableObject，儲存在資料夾中，用物件的形式也更好進行管理與共用。

{{< resources/image "multiple-target.gif" >}}

### 問題修正

**法線跳動**

在表面採樣的時候，除了計算位置以外還會對法線進行插值計算，用於後續使用。但在一些特定的物體上會遇到髮線隨機亂跳的現象，讓我後續計算出錯。

{{< resources/image "normal-glitch.gif" >}}

根據之前寫 ComputeShader 的經驗，我猜測是多個 Buffer 的 Append 執行時機導致。起初我透過多個 Buffer 分別儲存生成的各項屬性，想說「一起添加」的元素應該會有相同的 Index，這是合理的...在線性執行時，但在並行會有多個執行續同時進行自己的添加動作，導致實際的添加順序不可預測，發生索引穿插的現象，讓生成的點使用錯誤的髮線。

```csharp
AppendStructuredBuffer<float3> positions;
AppendStructuredBuffer<float3> directions;
AppendStructuredBuffer<float3> randomize;

[numthreads(64, 1, 1)]
void ScatterKernel (uint3 id : SV_DispatchThreadID)
{
    //...
    
    positions.Append(position);
    directions.Append(direction);
    randomize.Append(random);
}
```

理解之後就不難修正了，只要把三個 Buffer 合併再一起，透過 struct 一口氣儲存就不用擔心穿插問題了。

```csharp
struct ScatterPoint
{
	float3 position;
	float3 direction;
	float3 randomize;
};

AppendStructuredBuffer<ScatterPoint> scatterBuffer;
```

**密度修正**

雖然生成數量已經修正為「面積 x 密度」，但這是單一面的計算，
原本已面為單位 計算生成數量 但低於 1 

限制至少一個 但高密度的模型 面小 會很密集

```hlsl
data.count = max(1, target.area * _Density);
```

{{< resources/image "density-1.gif" >}}

找出進位時機 

```hlsl
index += _Seed;
float last = floor(target.area * (index - 1) * _Density);
float current = floor(target.area * index * _Density);
data.count = max(current - last, target.area * _Density);
```

{{< resources/image "density-2.gif" >}}

### 對齊方向 

遇到的最大難題 生成的點雖然有處存方向 但那是獨立的向量 而不是轉換矩陣 如果要讓 GPU instance 正確計算物體的旋轉 得要傳矩陣才行

{{< resources/image "not-align.gif" >}}

要怎麼讓物體朝向我要的方向呢 ? 

可以把方向向量換算成 角度 在用三角函數換算旋轉矩陣 但有更好的方式

矩陣是空間的線性變換 也可以視作一個向量空間的維度軸定義

{{< resources/image "transformation.jpg" >}}

參考 [https://www.youtube.com/watch?v=kYB8IZa5AuE](https://www.youtube.com/watch?v=kYB8IZa5AuE)

三維矩陣的三個欄 (column) 分別代表了線性空間的 三個軸軸向成

{{< resources/image "matrix3x3.jpg" >}}

因此我只要找出一個有我要的方向 與另外兩個垂直向量定義的空間就好 我們已經有法向量 與其中一邊 只要用 corss 再找出最後一個軸即可

將他們組成

註 : 查半天最後還是靠自己想通

只要有方向的向量 和另一個垂直向量 就能求出指向方向的矩陣 

{{< resources/image "direction.gif" >}}

只要將定義出的軸作為旋轉矩陣 就能讓他朝向表面方向 要注意的是我要向上對齊 所以方向要輸入在 Y 軸

```csharp
float3 direction;
float3 left = normalize(vertA - vertB);
float3 forwrad = cross(direction, left);

float3x3 dirMat = 0;
dirMat[0] = float3(left.x, direction.x, forwrad.x);
dirMat[1] = float3(left.y, direction.y, forwrad.y);
dirMat[2] = float3(left.z, direction.z, forwrad.z);
```

{{< resources/image "align.gif" >}}

最麻煩的部分就這樣了 

### 生成變化

位移

接著就是基本的 Transform 位移縮放旋轉 就不贅述這部分計算了

{{< resources/image "transform.gif" >}}

擠出

以及沿著自身方向的擠出 Y 是表面方向朝上 XZ 則是表面的平面 把位移量乘上方向矩陣

{{< resources/image "extrude.gif" >}}


噪聲 在平面上滑動 避免太過整齊

```hlsl
value.mapping += (rnd1To2(value.seed) - 0.5) * _Noising;
```

{{< resources/image "noise.gif" >}}


### 隨機數值

隨機化 才不會 看起來太過一致

讓每個點生成的時候攜帶隨機值 用來後續計算 三維 用顏色顯示

```csharp
AppendStructuredBuffer<float3> randomize;
```

{{< resources/image "random.gif" >}}


隨機

以及 當然要有隨機拉 (隨機應該往兩個方向才對 錄的時候才注意到寫錯

{{< resources/image "randomize.gif" >}}

除此之外 重構才注意到 矩陣乘法不想要位移的話 w 0 可以撤銷 不用另外建一個矩陣

```csharp
float3 vertexA = mul(_LocalToWorldMat, float4(verticesBuffer[indexA], 1)).xyz;
float3 vertexB = mul(_LocalToWorldMat, float4(verticesBuffer[indexB], 1)).xyz;
float3 vertexC = mul(_LocalToWorldMat, float4(verticesBuffer[indexC], 1)).xyz;

float3 normalA = mul(_LocalToWorldMat, float4(normalsBuffer[indexA], 0)).xyz;
float3 normalB = mul(_LocalToWorldMat, float4(normalsBuffer[indexB], 0)).xyz;
float3 normalC = mul(_LocalToWorldMat, float4(normalsBuffer[indexC], 0)).xyz;
```

### 生成遮罩

目前是所有採樣的表面都會生成 但實際情況可能不同 有些地方不想生

可能太低或太高的 例如只想生成在水平面下

{{< resources/image "filter-height.gif" >}}

或是角度 例如不想讓植物長在山壁上 簡單的距離場計算

{{< resources/image "filter-direction.gif" >}}

過度 不希望邊界太銳利的話 也可以利用隨機值過度

{{< resources/image "filter-fade.gif" >}}

## 感謝閱讀

{{< resources/image "result-terrain.gif" >}}

{{< resources/image "result-dinamic.gif" >}}

開學了 加上還沒有急迫的應用需求 先擱置 去研究其他東西

注意事項 Undo 會卡死

### 更多

噪聲過濾

分支

優化...但一竅不通

和 Marching Cube 應該能 environment generate 

發現一件可能知道但一直不敢面對的事實
我一直認為做出工具就能達到自己想要的目的了，但明明我沒有足夠的能力使用自己做的工具

{{< resources/image "result-faild.jpg" >}}

### 缺陷 

她能同時採樣多個物體 但無法防止重疊的位置

{{< resources/image "overlap.jpg" >}}

### 參考

[https://www.cgtrader.com/free-3d-models/exterior/landscape/low-poly-forest-nature-set-free-trial](https://www.cgtrader.com/free-3d-models/exterior/landscape/low-poly-forest-nature-set-free-trial)

[https://www.cgtrader.com/items/644366/download-page](https://www.cgtrader.com/items/644366/download-page)
