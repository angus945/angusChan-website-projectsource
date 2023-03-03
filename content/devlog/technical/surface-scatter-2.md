---
title: "【日誌】自動場景植被生成"
date: 2023-03-03
# lastmod: 2023-03-01

draft: true

description:
tags: [procedure-generation]

socialshare: true

## image for preview
feature: "/devlog/technical/surface-scatter-2/featured.jpg"

## image for open graph
# og: "/post/about-learning/featured.jpg"

## when calling "resources" shortcode, well link to static folder with this path 
resources: "/devlog/technical/surface-scatter-2/"

## customize page background
# background: [watercolor-A] 

## listout with recommand, new and all pages
# listable: [recommand, all]
---

本篇內容是[【日誌】沿著表面隨機生成]({{< ref "devlog/technical/surface-scatter-1.md" >}})的後續，我添加更多實用的生成屬性，能更據地形生成不同的植被。

<!--more-->

<!-- TODO 統一用詞 -->

## 更進一步 +-

上篇的內容是由一棵樹收尾的，展示了利用表面散佈的樹葉效果，但我相信他的潛力不僅止於此，便朝真實應用延伸功能，將各種可能的需求整合進去，讓系統更加豐富與人性化。  

### 成果展示 +-

同樣，先來展示這次的成果！

水草群落，只能在水面高度以下生成的植物，透過新系統的遮罩限制物體生成高度。

{{< resources/image "result-aquatic.gif" >}}

平原樹林，一顆正常的樹是不會長在水底、山壁與山頂的。

{{< resources/image "result-tree.gif" >}}

頂峰花海，在寒冷高原綻放的花朵。

{{< resources/image "result-flower.gif" >}}

### 儲存設定 +

說到應用時我第一個浮現的念頭便是「重複使用性」。以自然規律來說，植物能否生長是受環境限制的，水草只會在水底生長，樹木需要廣闊且深度足夠的平原，而高原風大寒冷，只有最堅韌的花朵們相互爭艷。

因此我們能將生成「設定」與生成「物體」分開處存，如此的好處是能將設定重複使用

相似的植物不需要 重複調整生成條件 設定出一個高原植物的設定，給所有合適的物件共用

將生成參數移到 ScriptableObject，儲存在資料夾中，用物件的形式也更好進行管理與共用。

{{< resources/image "multiple-target.gif" "80%" >}}

### 問題修正 +

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

### 對齊方向 +

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

### 生成屬性 +

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

### 生成遮罩 +

目前為止，系統會每個傳入的表面都進行採樣，但實際應用上我們可能項限制物件生成的位置，設定物體只能、不能生在哪裡，於是著色器常用的經典技術「距離場」就派上用場了。

根據特定平面進行裁剪，透過向量表示面的朝向，使用 `dot()` 函式將採樣點投影到平面的方向軸上，得出對於平面的最短距離，用於後續的過濾判斷。

```hlsl
filteValue = dot(planeDir, result.position);
```

{{< resources/image "filter-height.gif" "80%" >}}

也可以使用角度過濾，透過 `dot()` 函式檢測表面的夾角大小，如果不想讓植物長在山壁上，就能在當表面過於傾斜時把物件過濾掉。

```hlsl
filteValue = dot(direction, result.direction);
```

{{< resources/image "filter-direction.gif" "80%" >}}

最後，如果不希望邊界太銳利的話，也可以利用隨機值產生過度範圍。

{{< resources/image "filter-fade.gif" "80%" >}}

## 感謝閱讀 +

大功告成，把地形的模型放進去就能自動生成植被了。地形是使用 Blender 製作的，原本想直接用 Unity Terrain，但它預設只有 Height Map 而已，模型資料是被系統隱藏的，有點可惜。

{{< resources/image "result-dinamic.gif" >}}

我也多坐了幾個地形展示效果，只要生成規則設定好就能直接套用了。

{{< resources/image "result-terrain.gif" >}}

有興趣的人可以玩玩看。但要注意這只是一個實驗玩具而已，有相當多操作缺陷與應用問題在，離能稱做工具還有一大段距離。

[ComputeShader Toolbox - PointCloudScatter](https://github.com/angus945/compute-shader-toolbox/tree/main/Assets/PointCloudScatter)

因為能力不夠預測需要的功能，在沒有實際需求的情況下很難知道該做什麼，加上學校也開學了，個人規劃上比較希望廣泛的研究各種東西，而不是停在一個地方打磨，所以短期內不會完善這套系統，頂多想到什麼有趣的功能就加加看而已吧 :P

### 參考資料

[Similar free VR / AR / Low poly 3D Models](https://www.cgtrader.com/free-3d-models/exterior/landscape/low-poly-forest-nature-set-free-trial)

[Essence of linear algebra - Linear transformations](https://www.youtube.com/watch?v=kYB8IZa5AuE)
