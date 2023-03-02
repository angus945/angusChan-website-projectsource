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

{{< resources/image "multiple-target.gif" "80%" >}}

### 問題修正 -

**法線跳動**

在表面採樣的時候，除了計算位置以外還會對法線進行插值計算，用於後續使用。但在一些特定的物體上會遇到髮線隨機亂跳的現象，讓我後續計算出錯。

{{< resources/image "normal-glitch.gif" "80%" >}}

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

雖然生成數量已經修正為「面積 x 密度」，但這是僅限於單一面的計算，為了避免生成數量小於一導致不生成任何物件，我將數量限制為至少 1 個。這能避免密度數值過低導致沒有任何物件生成，但也導致無論如何每面都會生成一個物件，以至於生成總數至少會等於模型面數。

```hlsl
data.count = max(1, target.area * _Density);
```

{{< resources/image "density-1.gif" "80%" >}}

為了修正這點，我們不能粗暴的限制數值，必須找回這些遺失的小數，才能知道真正該生成的數量有多少。由於並行計算無法做累積數值的動作，所以我只能假設所有面的面積都相似，將生成數量乘上面自身的索引值，「猜測」目前為止生成累績的小數數值（例：目前生成了 3 * 1.4 = 4.2 個點）。

```hlsl
float currentCount = target.area * index * _Density;
```

取得了小數的累積數值，接著就是要判斷是不是累積超過一個點，或者說發生了「進位」現象。但要如何找出進位時機？只靠數值自身是無法判斷的，必須有東西參照才行，我們可以將「上一個面」生成的數量作為參照，將整數的數量相減就能知道是否發生進位。

```hlsl
float lastCount = target.area * (index - 1) * _Density;
float currentCount = target.area * index * _Density;
float carry = floor(currentCount) - floor(lastCount);
```

如此一來，就算生成數量不足 1，留下的小數點也能被計算，確保密度低時的生成表現理想。

{{< resources/image "density-2.gif" "80%" >}}

### 對齊方向 -

雖然生成時會透過法線計算點朝向的方向，但那只是獨立的向量資料，無法讓生成的物件對齊。物件在渲染的時候，他的位移、旋轉與縮放是透過 4x4 的齊次座標矩陣儲存的，vertex shader 會將頂點座標轉換成世界座標，用於後續的轉換工作。

{{< resources/image "not-align.gif" "80%" >}}

要怎麼讓物體指向我要的方向呢？最直觀的方式是把法線轉換成三軸的旋轉角度，在用三角函數建立三維空間的旋轉矩陣，但這樣太慢了，無論寫起來還是運作起來。

在二維的線性空間中，世界是由 <c>i-hat</c> 與 <r>j-hat</r> 兩個「向量軸」定義的，能透過 2x2 矩陣表示。當物體的原始向量（座標）與兩軸相乘後，就會得到他在線性變換中後的最終位置。

{{< resources/image "matrix-2x2.gif" "80%" >}}

而三維空間則多了一個 <span style="color:#4a94fe">k-hat</span>，同樣可以由 3x3 矩陣表示。因此我只要找出代表空間的三個軸向，就能將點轉向表面指向的方向了。

{{< resources/image "matrix-3x3.jpg" "80%" >}}

我們能在生成點時用插值取得法向量 (up)，而側邊 (left) 則可以透過頂點相減取得，最後一步就是計算出指向正面 (forward) 的向量為何，能透過 `cross()` 函式取得。

{{< resources/image "direction.gif" "80%" >}}

最後只要透過這三個軸建立矩陣，就能獲得使點轉向表面方向的矩陣了。要注意我想向上對齊，所以方向要輸入在 <c>j-hat</c> 軸。

```csharp
float3 direction;
float3 left = normalize(vertA - vertB);
float3 forwrad = cross(direction, left);

float3x3 dirMat = 0;
dirMat[0] = float3(left.x, direction.x, forwrad.x);
dirMat[1] = float3(left.y, direction.y, forwrad.y);
dirMat[2] = float3(left.z, direction.z, forwrad.z);
```

{{< resources/image "align.gif" "80%" >}}

### 生成屬性 -

最麻煩的對齊完成後，位移、縮放與旋轉也不是問題，就不贅述這部分計算了。

{{< resources/image "transform.gif" "80%" >}}

除了沿世界座標的位移，還有沿著表面方向的擠出效果，透過前面取得的方向矩陣就能達成。

{{< resources/image "extrude.gif" "80%" >}}

為了讓分佈更加自然，生成也添加了噪聲屬性，讓物體隨機在表面上偏移，破壞平均分佈的整齊感。

{{< resources/image "noise.gif" "80%" >}}

除此之外，除錯才注意到矩陣相乘時能透過 w 軸分量設為零來抵銷位移計算，因為位移是矩陣第四欄與 vector.w 相乘的結果，之前都忽略了這件事。

```csharp
float3 vertexA = mul(_LocalToWorldMat, float4(verticesBuffer[indexA], 1)).xyz;
float3 vertexB = mul(_LocalToWorldMat, float4(verticesBuffer[indexB], 1)).xyz;
float3 vertexC = mul(_LocalToWorldMat, float4(verticesBuffer[indexC], 1)).xyz;

float3 normalA = mul(_LocalToWorldMat, float4(normalsBuffer[indexA], 0)).xyz;
float3 normalB = mul(_LocalToWorldMat, float4(normalsBuffer[indexB], 0)).xyz;
float3 normalC = mul(_LocalToWorldMat, float4(normalsBuffer[indexC], 0)).xyz;
```

### 隨機數值 +

隨機是一定要的，畢竟自然物體不會是絕對整齊，每顆草木都有些為的差異存在。我讓每個點生成時根據索引產生一組隨機數值，可以傳入渲染管線中使用。

{{< resources/image "random.gif" "80%" >}}

隨機改變生成參數，讓物體生成時有隨機的旋轉、位移與縮放。

{{< resources/image "randomize.gif" "80%" >}}

### 生成遮罩

目前為止，

目前是所有採樣的表面都會生成 但實際情況可能不同 有些地方不想生

可能太低或太高的 

```hlsl
filteValue = dot(planeDir, result.position);
```

{{< resources/image "filter-height.gif" "80%" >}}

或是角度 例如不想讓植物長在山壁上 簡單的距離場計算

```hlsl
filteValue = dot(direction, result.direction);
```

{{< resources/image "filter-direction.gif" "80%" >}}

過度 不希望邊界太銳利的話 也可以利用隨機值過度

{{< resources/image "filter-fade.gif" "80%" >}}

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

參考 [https://www.youtube.com/watch?v=kYB8IZa5AuE](https://www.youtube.com/watch?v=kYB8IZa5AuE)
