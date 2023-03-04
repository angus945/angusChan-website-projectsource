---
title: "【日誌】根據地形生成場景植被"
date: 2023-03-03
# lastmod: 2023-03-01

draft: false

description: "接續【日誌】沿著表面隨機生成，能更據地形生成不同的植被的工具"
tags: [cpmpute-shader, procedure-generation]

socialshare: true

## image for preview
feature: "/devlog/technical/surface-scatter-2/featured.jpg"

## image for open graph
og: "/devlog/technical/surface-scatter-2/result-tree.gif"

## when calling "resources" shortcode, well link to static folder with this path 
resources: "/devlog/technical/surface-scatter-2/"

## customize page background
# background: [watercolor-A] 

## listout with recommand, new and all pages
listable: [recommand, all]
---

本篇內容是[【日誌】沿著表面隨機生成]({{< ref "devlog/technical/surface-scatter-1.md" >}})的後續，我添加更多實用的生成屬性，能更據地形生成不同的植被。

<!--more-->

## 更進一步

上篇的內容是由一棵樹收尾的，展示了利用表面散佈達成的樹葉效果，但我相信他的潛力不僅止於此，便朝真實應用延伸功能，此篇文章便整合了更多可能的需求，讓系統更加豐富與人性化。  

### 成果展示

同樣，先來展示這次的成果！

水草群落，只能在水下生成的植物，透過新系統的遮罩限制物體生成高度。

{{< resources/image "result-aquatic.gif" >}}

平原樹林，一顆正常的樹是不會長在水底、山壁與山頂的。

{{< resources/image "result-tree.gif" >}}

頂峰花海，在寒冷高原綻放的花朵。

{{< resources/image "result-flower.gif" >}}

### 儲存設定

說到應用時，我第一個浮現的念頭便是「重複使用性」。以自然規律來說，植物能否生長是受環境限制的，水草只會在水底生長，樹木需要廣闊且深度足夠的平原，而高原風大寒冷，只有最堅韌的花朵們爭艷。

沿著規則的思路發展，我們能將生成參數獨立儲存，相似的就植物不需要重複設定條件，能透過模板共用這些屬性。我將參數移到 ScriptableObject 保存，方便管理與共用。

{{< resources/image "multiple-target.gif" "80%" >}}

### 問題修正

實做更複雜的效果前，先修正一些上次遺留的問題。

**法線跳動**

為了知道表面朝向的方向，我在頂點插值的同時也會對法線進行插值計算，但後來發現某些物體會發生法線亂跳的現象，尤其是球體或甜甜圈等曲面形狀更常發生。

{{< resources/image "normal-glitch.gif" "80%" >}}

根據過去編寫計算著色器的經驗，我猜測是 Buffer 的 Append 執行時機導致這個問題。起初我透過多個 Buffer 分別儲存生成的各項屬性，想說「一起添加」的元素應該會有相同的 Index，這是合理的...但僅限於「線性執行」時，並行會有多個執行續「同時」進行自己的添加動作，導致實際的添加順序不可預測，發生索引穿插的現象。

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

因此，讀取時就會發生索引相同卻訪問到非預期資料的情況，而錯誤的頂點與法線組合就產生亂跳的現象了。理解後不難修正，只要把三個 Buffer 透過 struct 合併，一口氣儲存就不怕穿插問題了。

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

在上篇文章中，為了保持生成分佈平均，我將生成數量的計算改為「面積 x 密度」，但這個數量是僅限於「單一面」的，因此每面的數量獨立，計算過程留下的小數點將直接進位，1.5 會生成 2 次、6.7 會生成 1 次，而 0.3 則至少生成 1 個點。

進位是想避免完全無法生成的情況發生（假如模型每面的生成數量不到 1，捨去等於完全不生成任何東西），但也讓面都至少會生成一個物體。這會導致生成總數大過實際指定的密度，尤其在指定密度偏小的時候。

```hlsl
data.count = ceil(target.area * _Density);
```

{{< resources/image "density-1.gif" "80%" >}}

想修正這點就不能粗暴的進位數值，必須將小數納入計算才能得到真正的數量。我們可以將小數累計，當進位就增加該面的生成數量，這個思路是合理的...至少在線性執行的情況下可行。

又是並行引發的難題，假如一切都是同時發生的，要如何進行數值的「累計」？

進行真正的累計是不可能的，所以我們只能 <h> 假設所有面的面積都相等，根據過去進行了多少次的計算，「猜測」目前為止累計的數量為何。 </h>

將該面要生成的數量與索引值相乘，就能得出猜測數量。假設目前處裡的面是第 5 面，它會生成的數量有 3.3 個點，那猜測的累計數量就是 5 * 3.3 = 16.5 個點。

```hlsl
float count = target.area * index * _Density;
```

取得了累記數值後，還得知道小數何時會累積成一個完整的點，或者說何時發生了「進位」現象...但要如何找出進位時機？

只靠單一數值是無法判斷的，必須有東西參照才行。我們可以 <h> 猜測「上一個面」累計了多少的數值，透過兩個數值的差異判斷是否發生進位 </h> ，只要將整數數量相減就能知道。

```hlsl
float last = target.area * (index - 1) * _Density;
float current = target.area * index * _Density;
float carry = floor(current) - floor(last);
```

將進位加入要生成的數量中，就能確保實際生成的總數更貼近理想的密度。雖然猜測數值會有誤差，但這是一場與並行計算的交易，捨棄精確度以換得更高的效能。

```hlsl
float count = carry + target.area * _Density;
```

{{< resources/image "density-2.gif" "80%" >}}

### 生成屬性

虛擬空間中的物體屬性會透過齊次座標矩陣表示，它的位移、旋轉與縮放都能直接在相乘後獲得，渲染管線也是透過矩陣換算頂點應該渲染的位置，圖學的基礎線代知識，這裡就不贅述了。

{{< resources/image "transform.gif" "80%" >}}

也添加了生成的噪聲屬性，讓物體隨機偏移，破壞平均分佈的整齊感。

{{< resources/image "noise.gif" "80%" >}}

除此之外，矩陣乘法能透過 w 軸開關位移計算，因為位移是矩陣第四欄與 vector.w 相乘的結果，用於旋轉向量很方便。

```csharp
float3 vertexA = mul(_LocalToWorldMat, float4(verticesBuffer[indexA], 1)).xyz;
float3 vertexB = mul(_LocalToWorldMat, float4(verticesBuffer[indexB], 1)).xyz;
float3 vertexC = mul(_LocalToWorldMat, float4(verticesBuffer[indexC], 1)).xyz;

float3 normalA = mul(_LocalToWorldMat, float4(normalsBuffer[indexA], 0)).xyz;
float3 normalB = mul(_LocalToWorldMat, float4(normalsBuffer[indexB], 0)).xyz;
float3 normalC = mul(_LocalToWorldMat, float4(normalsBuffer[indexC], 0)).xyz;
```

### 對齊方向

雖然生成時會保存法線，但那只是獨立的向量資料，無法讓生成的物件對齊。目前為止，計算只會將自身的變換傳入矩陣，讓所有物體的角度一致。

{{< resources/image "not-align.gif" "80%" >}}

有些情況我們會想讓物體對齊表面，最直接的方式是把法線轉換成三軸的旋轉角度，再用三角函數建立三維空間的旋轉矩陣，但這樣無論寫還是運作都太慢了，我們可以用更有效律的方式達成。

在二維的線性空間中，世界是由 <c>i-hat</c> 與 <r>j-hat</r> 兩個「向量軸」定義的，能透過 2x2 矩陣表示。當物體的原始向量（座標）與矩陣相乘後，就會得到他在線性變換中後的最終位置。

{{< resources/image "matrix-2x2.gif" "80%" >}}

而三維空間則多了一個 <span style="color:#4a94fe">k-hat</span>，同樣可以由 3x3 矩陣表示，因此只要找出代表空間的三個軸向，就能將向量與表面對齊了。

{{< resources/image "matrix-3x3.jpg" "80%" >}}

我們能在生成時用插值取得法向量 (up)，而側邊 (left) 則可以透過頂點相減取得，最後一步就是計算出指向正面 (forward) 的向量為何，能使用 `cross` 函式計算得出。

{{< resources/image "direction.gif" "80%" >}}

只要透過這三個向量建立矩陣，就能獲得對齊表面方向的旋轉矩陣了。要注意的是我想向上對齊，所以方向要輸入在 <c>j-hat</c> 軸。

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

對齊方向以後，我也能讓物體沿著表面做擠出動作，而不限於世界座標的位移。

{{< resources/image "extrude.gif" "80%" >}}

### 隨機數值

隨機是一定要的，畢竟自然物體不會全都長一個樣，就算花草樹木都使用相同的模型，還是能透過縮放、旋轉讓他們看起來有些微差異。每個點生成時都會根據索引計算自己的種子碼，再根據種子碼產生隨機數值。

```hlsl
float seed = pointIndex + (faceIndex * 1000) + _Seed;
```

{{< resources/image "random.gif" "80%" >}}

而隨機就能用來改變生成參數，讓物體能有不同的位移、旋轉與縮放。

{{< resources/image "randomize.gif" "80%" >}}

### 生成遮罩

目前為止，系統會平均在整個模型上採樣，但實際情況中我們可能想限制物件生成的範圍，設定物體能或不能出現在哪裡。

著色器的經典技術「距離場」也派上用場了，使用 `dot` 函數取得點和平面的最短距離，將低於指定平面的物體過濾。

```hlsl
filteValue = dot(planeDirection, pointPosition);
```

{{< resources/image "filter-height.gif" "80%" >}}

也可以根據表面角度判斷，如果不想讓植物長在山壁上，也能計算表面的夾角大小，將生在陡峭表面的物件過濾掉。

```hlsl
filteValue = dot(direction, surfaceDirection);
```

{{< resources/image "filter-direction.gif" "80%" >}}

如果覺得邊界太銳利也能用隨機產生過度範圍，讓生態的交界更加自然。

{{< resources/image "filter-fade.gif" "80%" >}}

## 感謝閱讀

最後，設定完各種規則就能生成植被了，不同地形都能直接套用，不用重新調整參數。

{{< resources/image "result-terrain.gif" >}}

地形是使用 Blender 製作的，原本想兼容 Unity Terrain，但它預設只有 Height Map 資料而已，模型被隱藏在系統後方，可能要進行一些工序才能套用，但這就超出研究範圍了。

{{< resources/image "result-dinamic.gif" >}}

有興趣的人可以玩玩看，但這只是實驗玩具而已，還有相當多操作缺陷與應用問題在，遠不到能稱作工具的水準。有任何想法都歡迎提出討論（所以說那個留言板呢...）

[ComputeShader Toolbox - PointCloudScatter](https://github.com/angus945/compute-shader-toolbox/tree/main/Assets/PointCloudScatter)

至於接下來的發展...我也還在思考中，個人規劃上比較希望廣泛的研究各種東西，加上學校也開學了，短期內可能不會花太多時間完善這套系統吧？或許可以先研究好渲染，等知道怎麼把場景弄漂漂亮亮後也會更有動力完成工具。

感謝閱讀，喜歡文章請幫我按讚和分享歐 :D

{{< outpost/likecoin >}}

### 參考資料

[Similar free VR / AR / Low poly 3D Models](https://www.cgtrader.com/free-3d-models/exterior/landscape/low-poly-forest-nature-set-free-trial)

[Essence of linear algebra - Linear transformations](https://www.youtube.com/watch?v=kYB8IZa5AuE)

<p style="color:rgba(0, 0, 0, 0.2)">
嗚嗚學校作業一堆不想做啦 (´;ω;`)
</p>