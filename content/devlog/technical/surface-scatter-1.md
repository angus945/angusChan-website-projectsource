---
title: "【日誌】在模型表面隨機散佈物體"
date: 2023-03-02
# lastmod: 2023-02-27

draft: false

description: "我製作了沿著物體表面生成大量物件的工具，說不定在未來的某時會派上用場"
tags: [compute-shader, procedure-generation]

socialshare: true

## image for preview
feature: "/devlog/technical/surface-scatter-1/featured.jpg"

## image for open graph
og: "/devlog/technical/surface-scatter-1/result-1.gif"

## when calling "resources" shortcode, well link to static folder with this path 
resources: /devlog/technical/surface-scatter-1/

## customize page background
# background: [watercolor-A] 

## listout with recommand, new and all pages
listable: [recommand, all]
---

之前就對 Stylize 3D 渲染感興趣了，鋪於地面的清脆毛毯，隨風搖曳的蓬鬆樹葉，光待在賞心悅目的世界裡就是種幸福。總之，這次我製作了沿著物體表面生成大量物件的工具，說不定能在未來的某時派上用場。

<!--more-->

## 起因

之前看到一部 3D Pixel Rendering 的影片，透過特別的方式渲染漂亮的像素場景，每個角度看來都像精緻的圖畫，也是我最想要追求的目標之一。當中樹葉與草地就是透過 GPU Instance 生成的，沿著地面與樹木生成植被，再使用像素著色器渲染風格化場景。

{{< youtube "ERA7-I5nPAU" >}}

&nbsp;

除此之外，為了擴展技美的技能樹，我也接觸了程序建模軟體 Houdini，一個使用理性進行美術設計的神奇工具。當中有個實用的節點稱作 Scatter，它可以沿著輸入模型的表面隨機生成 PointCloud，讓使用者進一步生成其他物件，相當方便。

{{< resources/image "houdini.gif" "80%" >}}

受此啟發，我也想研究背後的數學原理，並嘗試在 Unity 中實作相似功能。

### 成果展示

首先，先展示成果吧！我找了一個樹木的模型當基底，沿著樹葉的部份生成大量方塊，看起來就像由色塊點綴而成的圖畫。

{{< resources/image "result-1.gif" >}}

## 技術研究

想不到看似簡單的功能會隱藏那麼多的難題，接下來請讓我解釋其中的各種原理。

### 模型採樣

既然是沿著表面生成，取得模型資料就是我們的第一步。3D 模型是由許多的三角面組合而成，而每個面都會有三個頂點，電腦則透過「頂點」與「索引」的陣列儲存整個模型。

{{< resources/image "mesh.jpg" "50%" >}}

在 Unity 裡可以透過 `Mesh.vertices` 與 `Mesh.triangles` 取得我們要的資料。每三個 `triangles` 為構成面的一組索引，只要其映射到 `vertices` 資料就能建構一個三角面，遍歷所有索引就能重建出整個模型。

```csharp
void ForeachFace()
{
    Vector3[] vertices = surface.vertices;
    int[] triangles = surface.triangles;

    for (int i = 0; i < triangles.Length; i += 3)
    {
        Vector3 pointA = vertices[triangles[i + 0]];
        Vector3 pointB = vertices[triangles[i + 1]];
        Vector3 pointC = vertices[triangles[i + 2]];

        DrawTriangle(pointA, pointB, pointC);
    }
}
```

{{< resources/image "mesh-wireframe.jpg" "80%" >}}

### 表面取點

取得模型的資料後，只要在每個面上進行隨機生成就能達成 Scatter 的效果了。在三角形上採樣最簡單方式就是雙重插值，將隨機作為權重就能產生隨機的位置了。

```csharp
Vector3 rndBottom = Vector3.Lerp(pointA, pointB, UnityEngine.Random.value);
Vector3 rndPoint = Vector3.Lerp(rndBottom, pointC, UnityEngine.Random.value);

scatterPoints.Add(rndPoint);
```

{{< resources/image "triangle-random.gif" "80%" >}}

只要散佈大量的點，就能得到類似全息圖的樣子了...大功告成？

{{< resources/image "scatted-1.jpg" "80%" >}}

不，這還只是開始而已。

### 機率修正

從上面的方塊可以看出角落的聚集了更多點，這是機率不平均導致的，因為二次插值時朝頂點的一邊會有較高的密度，視覺化會更好理解原因。

{{< resources/image "triangle-probability.jpg" "80%" >}}

我沒找到能在三角型裡「直接」產生機率平均的隨機算法，但是平行四邊形就不同了，它能很好的達成平均隨機，因此我把四邊形視作兩個三角形計算，轉換思路。

{{< resources/image "rectangle.gif" "80%" >}}

先在四邊形上隨機生成，再把超出範圍的點重新映射回三角形，如此一來就能得到平均的散佈算法了。

{{< resources/image "rectangle-remapping.gif" "80%" >}}

檢查插值的權重，當水平與垂直相加大於一時，就代表位置超出三角型的邊界，只要反轉權重就能讓它回到正確範圍中了。

```csharp
float abRnd = UnityEngine.Random.value;
float acRnd = UnityEngine.Random.value;

if (abRnd + acRnd > 1)
{
    abRnd = (1 - abRnd);
    acRnd = (1 - acRnd);
}

Vector3 abShift = Vector3.Lerp(Vector3.zero, b - a, abRnd);
Vector3 acShift = Vector3.Lerp(Vector3.zero, c - a, acRnd);
return a + abShift + acShift;
```

{{< resources/image "rectangle-probability.jpg" "80%" >}}

### 數量修正

起初我指定生成的「數量」來控制每面進行隨機的次數，但它產生的效果並不理想，因為模型面數會直接影響生成總數，且定值會導致過大或過小的面看起來也更稀疏、擁擠。

{{< resources/image "instance-count.jpg" "70%" >}}

為維持結果穩定，我將輸入的參數從「數量」改變為「密度」，讓算法根據每面的「面積」決定生成數量。原本我用一堆計算求出高再換算面積，後來發現能用外積函式推導出結果，花了一點時間消化原理，感謝朋友題點。

{{< resources/image "triangle-area.jpg" "80%" "引用自 The vector product" >}}

在線性代數的世界中，我們能 <h> 透過行列得出單位面積在線性變換後產生的「變化量」 </h> ，將兩軸建立出的矩形減去縮減空間，就能得出實際面積，看 3B1B 的示意圖應該很好理解了。因此只要將三角型的兩邊作為向量輸入，就能求出平行四邊形面積。

{{< resources/image "determinant.jpg" "80%" "擷取自 3B1B 的 Essence of linear algebra 系列" >}}

而在三維空間裡，可以透過外積 `corss` 達成目標，將兩個向量輸入函數會獲得垂直於兩向量的法線，這個法線長度同時也代表了平行四邊型的面積。

{{< resources/image "corss.jpg" "80%" "擷取自 3B1B 的 Essence of linear algebra 系列" >}}

<p><c>
註：外積的部份我也還在還在消化，這裡略過計算原理的解釋，先知道結果就好。
</c></p>

因此，三角形面積就能透過外積長度除二取得，相當快速。

```csharp
Vector3 cross = Vector3.Cross(pointB - pointA, pointC - pointA);
float area = length(cross) / 2;
```

回到數量計算，只要將面積乘上生成的密度數值，就能確保整體密度維持平均，大面積的區域會生成更多點，而小區塊則會減少生成數量。

```csharp
float density;
int amount = area * density;

for(int i = 0; i < amount; i++) { }
```

{{< resources/image "instance-density.gif" "80%" >}}

### 重疊修正

完全隨機的結果可能發生重疊，這在生成大型物體時可不是理想現象，所以我把生成方式改成真正的平均分佈，將索引平均映射到矩形範圍中，產生整齊的結果。

```csharp
for(int i = 0; i < amount; i++)
{
    x = i % width
    y = i / width
}
```

因為機率修正的改動，平均映射又會產生位置重疊的問題，我嘗試只生成一半再重新映射填滿三角形...但還是可能發生重疊問題，可以看到接縫處的樣子並不理想。

{{< resources/image "tidy-remap.jpg" "80%" >}}

最後決定直接在整個矩形範圍生成，捨棄一半的資料，雖然導致後續並行運算的效能對折，但至少結果是理想的。

{{< resources/image "tidy.gif" "80%" >}}

<p><c>
註：生成結果傾斜的是因為我沒捨棄計算時的小數點資料，捨去的誤差又會導致某些結果重疊，不清楚具體原因。
</c></b>

### 並行生成

最後一步，為了達成超大量的物件生成（和渲染），我重寫了並行版本的算法，透過計算著色器運行。內容與 C# 大致相同，只是資料的儲存與傳遞有些改變，需要透過 `ComputeBuffer` 將模型資料傳入 GPU 才能計算，而生成的結果也會留在 GPU Buffer 裡。

```hlsl
StructuredBuffer<int> trianglesBuffer;
StructuredBuffer<float3> verticesBuffer;
AppendStructuredBuffer<float3> scatterBuffer;
```

並行是以面為單位進行的，也更貼合實際情況會使用的複雜表面。這裡就不解釋細節了，有興趣的人可以參考以前的筆記[【筆記】初學指南，計算著色器]({{< ref "\learn\compute-shader\compute-shader-basis.md" >}})。

```hlsl
[numthreads(64, 1, 1)]
void ScatterKernel (uint3 id : SV_DispatchThreadID)
{
    if(id.x >= _FaceCount) return;
   
    int index = id.x * 3;
    float3 vertA = scatterBuffer[trianglesBuffer[index + 0]];
    float3 vertB = scatterBuffer[trianglesBuffer[index + 1]];
    float3 vertC = scatterBuffer[trianglesBuffer[index + 2]];

    float area = length(cross(vertB - vertA, vertC - vertA)) / 2;
    
    int count = area * _Density;
    for(int i = 0; i < count; i++)
    {
        //...
    }
}
```

透過偉大的圖學力量，每幀生成十萬個點都不是問題。一直閃是因為 seed 也不斷改變。

{{< resources/image "compute-istance.gif" "80%" >}}

## 感謝閱讀

### 結果渲染

將生成結果傳入渲染管線，再加上光照計算就有繪畫風的樹葉了。研究的第一階段到此為止，接下來就是朝實際應用思考，後續請見[【日誌】根據地形生成場景植被]({{< ref "devlog/technical/surface-scatter-2.md" >}})。

{{< resources/image "result-2.gif" >}}

喜歡文章請幫我按讚和分享歐 :D

{{< outpost/likecoin >}}

### 參考資料

[Generate random points in a triangle](https://blogs.sas.com/content/iml/2020/10/19/random-points-in-triangle.html)

[Vector products and the area of a triangle](https://www.maths.usyd.edu.au/u/MOW/vectors/vectors-11/v-11-7.html)

[Determinant | Essence of linear algebra](https://www.youtube.com/watch?v=Ip3X9LOh2dk&list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab&index=6)

[Cross prducts | Essence of linear algebra](https://www.youtube.com/watch?v=eu6i7WJeinw&list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab&index=10)

[Cross prducts as transformations | Essence of linear algebra](https://www.youtube.com/watch?v=BaM7OCEm3G0)