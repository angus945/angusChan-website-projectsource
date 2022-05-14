---
title: "第一章 初步理解"
date: 2021-04-27T21:34:48+08:00
lastmod: 2021-04-27T21:34:48+08:00
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

標準化空間，大小為 1

## 對距離場原理的初步理解

在第一次接觸距離場時，可以先理解成一個 "判斷空間中任意位置在不在虛擬形狀內" 的函數。

我們從一個圓形開始，點和中心的距離如果小於圓的半徑代表在圓內，很好理解吧。

```csharp
float inCircle(float2 uv, float radius)
{
    if (length(uv) < radius) return 0;
    else return 1;
}
fixed4 frag (v2f i) : SV_Target
{
    float2 uv = spaceNormalize(i.uv, 1);
    
    fixed4 col = inCircle(uv, 1);
    return col;
}
```

結果如下，當距離小於半徑時畫黑色，反之白色

{{< resources/image preliminary_0.jpg "50%" >}}

### 小題目

請試著用相同的方法，寫出一個判斷任意點在不在矩形內部的函數

```csharp
float inSquare(float2 uv, float2 size);
fixed4 col = inSquare(uv, float2(1, 1.5));
```

{{< resources/image preliminary_1.jpg "50%" >}}

初步理解就到這裡，接下來會帶你們了解距離場的真正意義
