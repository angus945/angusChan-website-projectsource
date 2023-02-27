---
title: "【日誌】沿著表面隨機生成"
date: 2023-02-27
lastmod: 2023-02-27

draft: true

description:
tags: [procedure-generation]

socialshare: true

## image for preview
feature: "/devlog/technical/surface-scatter-1/featured.jpg"

## image for open graph
# og: "/post/about-learning/featured.jpg"

## when calling "resources" shortcode, well link to static folder with this path 
resources: /devlog/technical/surface-scatter-1/

## customize page background
# background: [watercolor-A] 

## listout with recommand, new and all pages
# listable: [recommand, all]
---

之前就對 Stylize 3D 渲染感興趣了，毛茸茸的花草樹木看著就心情愉快，這次嘗試製作了能幫我沿著物體表面生成植被的工具，說不定能在未來的某時派上用場。

<!--more-->

## 起因 +

之前看到一部 3D Pixel Rendering 的影片，透過特別的方式實時渲染漂亮的像素場景，每個角度看起來都像一幅精緻的圖畫，也是我最想要追求的目標之一。影片中樹葉與草地就是透過 GPU Instance 達成的，從模型表面生成大量物件，再透過像素 Shader 風格化渲染出漂亮的畫面。

{{< youtube "ERA7-I5nPAU" >}}

&nbsp;

除此之外，為了擴展技美的技能樹，我也稍微接觸了下程序建模軟體 Houdini，是一個需要用理性進行美術設計的神奇工具。當中有個實用的節點稱作 Scatter，他可以對輸入的模型採樣，在表面上隨機生成點，並透過這些點再生成其他物件，相當方便。

{{< resources/image "houdini.gif" >}}

受此啟發我也想嘗試實作一次效果，讓我離目標更進一步。

### 成果展示 +

首先！先展示成果吧。我找了一個樹木的 3D 模型，沿著樹葉的 Mesh 資料生成了許多純色方塊，讓它看起來就像畫出來的一樣。

{{< resources/image "result-1.gif" >}}

## 研究 +

現在請讓我回過頭解釋一下過程和原理，也是一波三折阿。

### 模型採樣 +

首先，既然要沿著表面生成，第一步就要想辦法取得模型的資料。3D 模型是以許多的三角面組成方式而成，而每個面都會有三個頂點，模型儲存這些資料的方式則是透過頂點陣列與索引陣列。

{{< resources/image "mesh.jpg" "50%" >}}

在 Unity 中可以透過 `Mesh.vertices` 與 `Mesh.triangles` 取得我們要的資料。模型以以三個 `triangles` 為單位表示一個面，只要將索引映射到 `vertices` 就能取得頂點座標，建構出模型的三角面，只要遍歷所有 `triangles` 就能重建整個模型的樣子。

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

### 隨機取點 +

取得整個模型的資料後，只要以面為單位進行隨機生成就能達成散佈效果了。最簡單的就是透過兩個插值，計算出在表面上的位置，將隨機輸入權重以產生表面上的隨機位置。

```csharp
Vector3 rndBottom = Vector3.Lerp(pointA, pointB, UnityEngine.Random.value);
Vector3 rndPoint = Vector3.Lerp(rndBottom, pointC, UnityEngine.Random.value);

scatterPoints.Add(rndPoint);
```

{{< resources/image "triangle-random.gif" "80%" >}}

大量生成後，將產生的結果視覺化就能得到類似全息圖的樣子了。

{{< resources/image "scatted-1.jpg" "80%" >}}

### 機率修正 +

從上面的方塊可以明顯看出角落的聚集了更多點點，這是插值算法的問題，因為機率不平均，可以透過平均分佈來視覺化機率，我們能看到第二次插值指向頂點的一端會有更高的密度。

{{< resources/image "triangle-probability.jpg" "80%" >}}

我沒有找到能直接在三角型中平均隨機的算法，但是矩形、平行四邊形就不同了，它們能很好的計算出平均的散佈，因此我們要轉換思路，把四邊形視作兩個三角形計算。

{{< resources/image "rectangle.gif" "80%" >}}

先在四邊形上隨機生成，再把超出到另一個三角形的點重新映射回原本的三角形，如此一來就不會有不平均的問題了。

{{< resources/image "rectangle-remapping.gif" "80%" >}}

檢查插值的數值，當水平與垂直的權重相加大於一時，就代表位置會超出三角型的邊界，只要透過反轉權重就能讓它回到原本的三角行了。

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

### 數量修正 +

為了保持實驗簡單，我直接指定每個面上的採樣次數，當輸入 5 的時候，算法會遍歷整個模型並對所有面隨機生成五次位置。但隨著更多的應用條件出現，我發現這種作法會導致生成結果不理想，因為面數更高的模型會產生更大量的點，並且讓每面的「密度」都不穩定，大面看起來會更稀疏，而之小面會過度擁擠。

{{< resources/image "instance-count.jpg" "70%" >}}

為了維持結果穩定，我將輸入的參數從「次數」改變為「密度」，讓算法根據每個面所擁有的「面積」動態改變生成次數。原本我用一連串計算推算三角形的高，再換算出面積，但後來發現能直接用外積長度 / 2 取得結果，花了一點時間消化原理，感謝朋友題點。

{{< resources/image "triangle-area.jpg" "80%" >}}

首先，在線性代數中我們能透過行列式算出單位面積在線性變換中產生的變化量，因此只要將三角型的三個頂點 `ABC` 換算成向量 `AB` 與向量 `AC`，作為行列式的輸入，就能求得向量構成的平行四邊形面積。

{{< resources/image "determinant.gif" "80%" "擷取自 3B1B 的 Essence of linear algebra 系列" >}}

而在三維空間中，則可以透過外積函式 `corss` 達成目標。將兩個向量輸入至外積函式，會取得另一個垂直於兩向量的法線，而這個法線長度同時也代表了平行四邊型的面積。

{{< resources/image "corss.jpg" "80%" "擷取自 3B1B 的 Essence of linear algebra 系列" >}}

因此，三維中的三角形面積就能透過外積長度 / 2 直接取得，相當快速。

```csharp
Vector3 cross = Vector3.Cross(pointB - pointA, pointC - pointA);
float area = length(cross) / 2;
```

最後再將面積乘上輸入的密度值，就能確保更大面積的區域會生成更多點點，反之更小的也會降低數量，維持整體密度平均。

```csharp
float density;
int amount = area * density;

for(int i = 0; i < amount; i++) { }
```

{{< resources/image "instance-density.gif" "80%" >}}

### 重疊修正 +

完全隨機的結果可能發生重疊，這在實際應用上不是個理想的現象，所以我把生成方式改成真正的平均分佈，將索引平均映射到矩形範圍中，產生整齊的結果。

```csharp
for(int i = 0; i < amount; i++)
{
    x = i % width
    y = i / width
}
```

因為機率修正那部份的改動，導致平均映射又會在三角型重新映射時與其他位置重疊，我嘗試只生成一半的點，透過重新映射填滿三角形。

{{< resources/image "tidy-remap.jpg" "80%" >}}

但這樣還是可能發生重疊問題，可以看到接縫處的樣子並不理想，所以最後決定忍痛捨棄一半的資料，直接在整個矩形範圍生成，雖然會導致並行的效能對折，但至少結果是理想的。

{{< resources/image "tidy.gif" "80%" >}}

<p><c>
註：生成結果斜斜的是因為我沒捨棄計算時的小數點資料，因為捨去的誤差可能導致某些結果重疊，我也不清楚具體原因。
</c></b>

三角行在各方面來說都有點麻煩呢，不知道有沒有不用重新映射也能達到平均分佈的算法。

### 並行生成 +

最後一步，為了在表面上生出很多很多的點，我也把計算搬運到計算著色器中了。算法與 C# 中基本相同，只是資料傳遞上有些改變，需要透過 `ComputeBuffer` 將模型資料傳入 GPU 中才能計算，而生成的結果也會被保存在 GPU Buffer 裡。

```hlsl
StructuredBuffer<int> trianglesBuffer;
StructuredBuffer<float3> verticesBuffer;
AppendStructuredBuffer<float3> scatterBuffer;
```

並行是以面為單位進行的，因此在複雜的模型上能發揮更好的表現。這裡就不解釋 Compute Shader 的細節了，有興趣的人可以參考我的筆記[【筆記】初學指南，計算著色器]({{< ref "\learn\compute-shader\compute-shader-basis.md" >}})。

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

透過偉大圖學的力量，用並行一口氣生成十萬個點，每幀即時刷新都不是問題。

{{< resources/image "compute-istance.gif" "80%" "一直閃是因為每次更新也會改變 seed" >}}

## 感謝閱讀

### 結果渲染

而且生成完畢的 buffer 還能直接傳給渲染管線 拿來做渲染的計算 蓬蓬樹

{{< resources/image "result-2.gif" >}}

{{< outpost/likecoin >}}

### 參考資料

[https://www.maths.usyd.edu.au/u/MOW/vectors/vectors-11/v-11-7.html](https://www.maths.usyd.edu.au/u/MOW/vectors/vectors-11/v-11-7.html)

[https://blogs.sas.com/content/iml/2020/10/19/random-points-in-triangle.html](https://blogs.sas.com/content/iml/2020/10/19/random-points-in-triangle.html)

[https://www.youtube.com/watch?v=Ip3X9LOh2dk&list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab&index=6](https://www.youtube.com/watch?v=Ip3X9LOh2dk&list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab&index=6)

[https://www.youtube.com/watch?v=eu6i7WJeinw&list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab&index=10](https://www.youtube.com/watch?v=eu6i7WJeinw&list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab&index=10)
