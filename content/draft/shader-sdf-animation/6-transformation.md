---
title: "第六章 位移旋轉"
date: 2021-07-28T10:20:32+08:00
lastmod: 2021-07-28T10:20:32+08:00
draft: false

description: ""
tags: []

## image for preview
# feature: 

## image for open graph
# og: "/post/about-learning/featured.jpg"

## when calling "resources" shortcode, well link to static folder with this path 
resources: /learn/shader/sdf-animation/

## customize page background
# background: static/shader/sandboxShader.glsl

## listout with recommand, new and all pages
# listable: [recommand, new, all]

---

標準化空間，大小為 3

## 位移、旋轉和縮放

我們將正式接觸距離場的的一個特性 - 空間操作性，在一般的空間轉換當中，我們會使用齊次座標矩陣進行轉換，但在距離場的世界似乎有什麼不太一樣。

為了理解這些基礎的空間操作，我們回到一開始的 UV，使用絕對值將負的部分也畫出來，黑色的部分就是空間中的心點。

```csharp
return fixed4(abs(uv).xy, 0, 1);
```

{{< resources/image "center.jpg" "50%" >}}

### 位移

首先是基本的位移。很簡單，只需要將輸入的 uv 加上要移動的方向。

```csharp
float2 translate(float2 uv, float2 offset)
{
    return uv + offset;   
}
```

來測試看看，讓空間往右上方偏移。

```csharp
uv = translate(uv, float2(2, 2));
```

{{< resources/image "offset_0.jpg" "50%" >}}

嗯...怎麼和想像中不一樣 ?

因為我們將 uv 直接加上位移值，在距離場的世界這麼做的意思是 "將整個空間的所有點都加上位移值" 。

讓示意圖幫助你理解。我們原本期望將中心點移到空間中的 (2, 2)，所以直接用加的將向量添加上去，但實際上我們想移到的位置原本就是 (2, 2) 了，再加一次等於 (4, 4)。

{{< resources/image "offset_1.jpg" "50%" >}}

反而空間中原本 (-2, -2) 的地方因為加了 2 變成 0，這就是為什麼空間的中心會朝我們期望的相反方向偏移。因此，為了讓位移如預想的狀態運作，必須要將加改為減才行。

```csharp
return uv - offset;
```

{{< resources/image "offset_2.jpg" "50%" >}}

### 旋轉

旋轉則是將 uv 與旋轉矩陣相乘，為了讓結果如預期角度需要輸入負值，原因和上面一樣。

```csharp
#define Deg2Rad 0.0174532925
```

```csharp
float2 rotate(float2 uv, float angle)
{
    float radian = -angle * Deg2Rad;

    float2x2 rotMatrix;
    rotMatrix[0] = float2(cos(radian), -sin(radian));
    rotMatrix[1] = float2(sin(radian),  cos(radian));
    
    return mul(rotMatrix, uv);
}
```

{{< resources/image "rotate.jpg" "50%" >}}

### 縮放

最後一項轉換就是縮放，距離場縮放也同樣和一般的轉換不同。

當我們想把空間放大兩倍時，如果我們用乘的，實際上會導致距離場被縮小，因為空間中每個點的值都被放大了，空間從 -3 ~ 3 變成 -6 ~ 6，如果有一個佔據 1/3 空間大小的距離場，就會只剩 1/6。

所以我們想要放大距離場該怎麼做 ? 沒錯，用除的，而且要小心別除以 0 了。

```csharp
float2 scale(float2 uv, float2 scale)
{
    return uv / max(scale, 0.000001);
}
```

{{< resources/image "scale.jpg" "50%" >}}

除了部分運算邏輯相反以外，距離場的位移、選轉或縮放，都是對整個空間的操作，而不是單一個體，至於其他部分都和原本的齊次座標一樣，包括順序對結果的影響，這部分的數學就不贅述了。最後，讓我們將這些操作添加回距離場上。

標準化空間，大小為 10、距離場上色、距離環

```csharp
float SDF_Rect(float2 uv, float2 size, float2 offset, float angle)
{
    uv = translate(uv, offset);
    uv = rotate(uv, angle);
    return SDF_Rect(uv, size);
}
```

```csharp
float distance = SDF_Rect(uv, float2(2, 3), float2(3, 6), 50);
```

{{< resources/image "example.jpg" "50%" >}}

恭喜~ 初階的空間操作就到此為止，下一篇將帶你們接觸距離場的第二項特性 - 組合

### 章節題目

請使用次篇教學的內容，達成類似的效果

提示 : 合成矩陣的特性，不同空間操作的順序

{{< resources/image "quest.jpg" "50%" >}}
