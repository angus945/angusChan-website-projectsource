---
title: "【日誌】沿著表面隨機生成"
date: 2023-02-13
lastmod: 2023-02-13

draft: true

description:
tags: []

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

之前就對特殊風格的 3D 渲染感興趣了，毛茸茸的草地和植被看著就令人舒適

<!--more-->

## 起因

之前看到一部影片，有人用 Unity 做出了像素的 3D 渲染，裡面的樹葉和花花草草相當漂亮，聽他解說是透過 身
gpu instance 生成的，再透過世界座標像素化

{{< youtube "ERA7-I5nPAU" >}}

&nbsp;

再來，為了為了擴展技美的技能樹，我前陣子玩了一下程序建模軟體 Houdini，裡面有一個節點叫做 Scatter 他可以對輸入的模型採樣，在表面隨機生成點，再透過這些點生成其他物件，相當方便

{{< resources/image "houdini.gif" >}}

受此啟發，我也想嘗試實作一次效果，實現那個蓬蓬樹葉

### 成果展示

慣例先展示成果

{{< resources/image "result-1.gif" >}}

## 研究

解釋一下研究過程和原理

### 模型採樣 

首先，第一步就是要想辦法對模型採樣，我預期透過 compute shader 進行計算，但畢竟它除錯難度太高，還是先透過 C# 做實驗

再表面生成得要取得模型的資料，Mesh 可以用  vertices 取的頂點 triangles 取的頂點索引，每個面由三個頂點構成，三個索引

{{< resources/image "mesh.jpg" >}}

```csharp
int[] triangles = mesh.triangles;
Vector3[] vertices = mesh.vertices;
```

每三個 triangles index 會映射到面的三個頂點，因此只要遍歷索引，就能映射到頂點表上重建模型

```csharp
void ForeachFace()
{
    Vector3[] vertices = surface.vertices;
    int[] triangles = surface.triangles;

    Matrix4x4 transformMatrix = transform.localToWorldMatrix;

    for (int i = 0; i < triangles.Length; i += 3)
    {
        Vector3 pointA = transformMatrix.MultiplyPoint(vertices[triangles[i + 0]]);
        Vector3 pointB = transformMatrix.MultiplyPoint(vertices[triangles[i + 1]]);
        Vector3 pointC = transformMatrix.MultiplyPoint(vertices[triangles[i + 2]]);

        DrawTriangle(pointA, pointB, pointC);
    }
}
```

{{< resources/image "mesh-wireframe.jpg" >}}

### 隨機取點

將所有的面取出後 ，只要在三個點之間隨機生成，就能獲得位於表面的位置了，簡單的方法就是透過兩個插值，將隨機值輸入權重，來產生面上的隨機位置

```csharp
Vector3 rndBottom = Vector3.Lerp(pointA, pointB, UnityEngine.Random.value);
Vector3 rndPoint = Vector3.Lerp(rndBottom, pointC, UnityEngine.Random.value);

scatterPoints.Add(rndPoint);
```

{{< resources/image "triangle-random.gif" >}}

只要對模型的每個面都進行數次，將結果顯示就能得到類似全息圖的樣子了

{{< resources/image "scatted-1.jpg" >}}

### 機率修正

但這種算法會產生一個問題，那就是機率不平均，可以看到第二次插值朝向其中一點的密度比較高

{{< resources/image "triangle-probability.jpg" >}}

在三角面上無法平均的隨機，但如果是四角面就不同了，而每個矩形也都是由兩個三角形組成的

{{< resources/image "rectangle.gif" >}}

因此我們只要在方形上隨機生成，然後再判斷是否超出範圍，把超出到另一個三角形的點重新映射回原本的三角形上就好

{{< resources/image "rectangle-remapping.gif" >}}

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

如此就能得出機率平均的散佈了

{{< resources/image "rectangle-probability.jpg" >}}

### 生成數量

剛開始我是指定數量決定每面要生多少個點，但這會導致生成數量受到模型面數的直接影響，相同數值會讓大面看起來密度較低，反之小面看起來密度過高。

{{< resources/image "instance-count.jpg" >}}

為了維持數量的穩定，我改成根據面積計算生成數量，原本我用一連串計算推算三角形的高，但後來發現能直接透過外積 corss 計算平行四邊形的面積

{{< resources/image "triangle-area.jpg" >}}

因為頂點是向量 ，行列式可以算出面積的變化量，而外積的結果就是純量面積 * 向量法線

{{< resources/image "corss.jpg" >}}

2.5 是影片中範例的外積結果，與我這無關

因此我只要求得外積的長度，除二就是我要的三角形面積了

```csharp
Vector3 cross = Vector3.Cross(pointB - pointA, pointC - pointA);
float area = length(cross) / 2;
```

生成參數從數量改成每單位面積的密度，在生成時計算出每面正確的生成量

```csharp
float density;
int amount = area * density;

for(int i = 0; i < amount; i++) { }
```

如此一來，即使放大表面積，生成次數也會自動增加以保持密度穩定

{{< resources/image "instance-density.gif" >}}

### 平均分布

最後，完全隨機的結果可能發生重疊，所以我把生成改成真正的平均分布，用索引值映射到矩形上，讓生成結果整齊排列

```csharp
for(int i = 0; i < amount; i++)
{
    x = i % width
    y = i / width
}
```

{{< resources/image "tidy-remap.jpg" >}}

但三角隨機的重新映射會導致太整齊的資料重疊，最後決定忍痛捨棄一半的資料，雖然效能直接對折，但至少結果是更理想的 

除非能直接平均映射在三角形上，不然從矩形生的話可能都不理想

{{< resources/image "tidy.gif" >}}

法線插值 

模型的頂點除了位置以外開會攜帶發法線  計算方法依樣 輸入進三角插值就好

有了法線就能知道點朝向的方向 我可以拿他根據法線方向擠出

{{< resources/image "extrude.gif" >}}

### 並行生成

最後 算法研究完畢 就是搬運到 Compute shader 上了 把模型資料傳進 buffer 給 shader 用

```csharp
StructuredBuffer<int> trianglesBuffer;
StructuredBuffer<float3> verticesBuffer;
StructuredBuffer<float3> normalsBuffer;
```

並行的威力 及時生成十萬個點都沒問題 一直閃示因為每次生都用新的 seed

{{< resources/image "compute-istance.gif" >}}

轉移計算到 Compute Shader 錯誤的隨機函式

### 結果渲染

而且生成完畢的 buffer 還能直接傳給渲染管線 拿來做渲染的計算 蓬蓬樹

{{< resources/image "result-2.gif" >}}

## 感謝閱讀

### 參考資料

[https://www.maths.usyd.edu.au/u/MOW/vectors/vectors-11/v-11-7.html](https://www.maths.usyd.edu.au/u/MOW/vectors/vectors-11/v-11-7.html)

[https://blogs.sas.com/content/iml/2020/10/19/random-points-in-triangle.html](https://blogs.sas.com/content/iml/2020/10/19/random-points-in-triangle.html)

[https://www.youtube.com/watch?v=Ip3X9LOh2dk&list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab&index=6](https://www.youtube.com/watch?v=Ip3X9LOh2dk&list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab&index=6)

[https://www.youtube.com/watch?v=eu6i7WJeinw&list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab&index=10](https://www.youtube.com/watch?v=eu6i7WJeinw&list=PLZHQObOWTQDPD3MizzM2xVFitgF8hE_ab&index=10)
