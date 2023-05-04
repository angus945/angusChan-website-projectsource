---
title: "第四章 距離辨識"
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

標準化空間，大小為 10、距離場上色

## 繪製距離環

我們為距離場的內外繪製上了不同的顏色用於辨識，但除了形狀自身之外，我們也想知道他位置的距離值，以便我們判斷函數計算正不正確。

因此，我們可以每隔一段距離就畫出一線條，來告訴我們那裏的距離。我們透過取小數函數 frac ，每隔一段距離就畫出重複的圖形。

```csharp
float majorDistance(float distance)
{
    return frac(distance);
}
```

將函數套用到距離計算上，請注意這裡輸入給函數的 distance 沒有進行無條件進位 :D

```csharp
float distance = SDF_circle(uv, 5);
float major = majorDistance(distance);
return major;
```

{{< resources/image "frac_0.jpg" "50%" >}}

呈現這個結果的原因是 frac 會將輸入值取小數，這讓整個距離的範圍在由 0 到 1 之間不斷重複。

{{< resources/image "frac_1.jpg" "50%" >}}

雖然它達到了顯示距離的目的，但看起來實在有夠醜的，我們只需要每一段距離畫一條線即可。添加一項屬性作為線條厚度，我們根據厚度繪製適當的線條即可。

```csharp
_LineThickness("Thickness", Range(0, 0.2)) = 0.1
```

```csharp
float _LineThickness;
```

而畫線的部分，我們使用閥值函數 step 從原本 0 到 1 的數值中過濾出想要的部分，只有每段的當距離小於厚度閥值時才會畫出線段。

```csharp
float majorDistance(float distance)
{
    return 1 - step(frac(distance), _LineThickness);
}
```

{{< resources/image "step_0.jpg" "50%" >}}

好看多了，每隔一段距離畫一圈線段，第幾圈就表示當前的位置是多少。

{{< resources/image "step_1.jpg" "50%" >}}

最後，我們只需要將原本距離場的顏色乘回去就大功告成。

```csharp
fixed4 frag (v2f i) : SV_Target
{
    float2 uv = spaceNormalize(i.uv, 10);

    float distance = SDF_circle(uv, 5);
    float edgeDistance = ceil(distance);

    fixed4 color = colorDistance(edgeDistance);

    float major = majorDistance(distance);
    return color * major;
}
```

{{< resources/image "distanceLine.jpg" "50%" >}}

這章教會了你們如何繪製距離環，距離環可以用來檢視函數計算是否正確，後面將會省略重複的部分。
