---
title: "第十章 組合範例"
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

標準化空間，大小為 10、距離場上色、距離環

## 進階形狀範例

教學到目前已經教了各種形狀、空間操作以及組合方法，這章就提供一些進階型狀的範例。

### 扇形環

先從從簡單的開始，一個扇形的圓環，將扇形剃除圓形。

```csharp
float SDF_RingSector(float2 uv, float radius, float thickness, float degree)
{
    float halfThickness = thickness * 0.5;
    float sector = SDF_Sector(uv, radius + halfThickness, degree);
    float circle = SDF_circle(uv, radius - halfThickness);
    return combina_cull(sector, circle);
}
```

{{< resources/image "ringSector.jpg" "50%" >}}

### 矩形環

教學中以矩形為例，當然實際繪製時要用什麼形狀是自由的，計算放射狀分割時的位置並放置形狀。

```csharp
float SDF_ringRectangles(float2 uv, float radius, float amount, float2 size)
{
    float2 direction; 

    uv = radial(uv, amount, direction);
    uv = rotate(uv, 180 / amount); 
    
    return SDF_Rect(uv, size, float2(radius, 0), 0);                
}
```

{{< resources/image "rectSector.jpg" "50%" >}}

### 齒輪

嘿對，就是搭配上面那個東西，圓環和矩形環。

```csharp
float SDF_gear(float2 uv, float radius, float thickness, float2 teethSize, float teethAmount)
{
    float core = SDF_Ring(uv, radius, thickness);

    float teethRadius = radius + teethSize.x * 0.5;
    float gearTeeth = SDF_ringRectangles(uv, teethRadius, teethAmount, teethSize);

    return combina_add(core, gearTeeth);
}
```

{{< resources/image "gear.jpg" "50%" >}}

### 星形

把矩形環的分割整理出來，搭配縮放正多邊形完成。

```csharp
float2 radialRadius(float2 uv, float amount, float radius)
{
    float2 direction; 

    uv = radial(uv, amount, direction);
    uv = rotate(uv, 180 / amount); 
    uv = translate(uv, float2(dot(float2(1, 0), direction) * radius, 0));
    
    return uv;              
}
```

```csharp
float SDF_star(float2 uv, float radius, float amount, float2 size)
{
    uv = radialRadius(uv, amount, radius);
    uv = scale(uv, size);
    return SDF_Regular(uv, 1, 3);
}
```

{{< resources/image "star.jpg" "50%" >}}

### 特殊線段

接續前幾章中的線段距離函數，我們可以使用線段的投影值做進階操作的參考，像是波浪。

```csharp
float SDF_waveLine(float2 uv, float2 pointA, float2 pointB, float thickness, 
    float frequency, float amplitude )
{
    //line sdf codes...
    
    float wave = sin(projToLine / lineLength * frequency * PI + _Time.y) * amplitude;
    return dist - thickness + wave;  
}
```

{{< resources/image "wobbleLine.jpg" "50%" >}}

或是錐形線段，只需要讓線段兩端使用不同的粗細去過度。

```csharp
float SDF_coneLine(float2 uv, float2 pointA, float2 pointB, 
    float thicknessA, float thicknessB)
{
    //line sdf codes...

    return dist - lerp(thicknessA, thicknessB, projToLine / lineLength);  
}
```

{{< resources/image "coneLine.jpg" "50%" >}}

除了以上兩種範例，線段當然還可以有其他進階操作，不過教學範例部分就先到此為止吧，以上只是提供你們不同的思路而已。

在繪製距離場形狀時可以透過"任何"計算過程中使用的的變數作為形狀加工的參考，以線段的例子來說我們使用的 uv 投影到線段上的大小作為參考，但事實上不只有線段可以這樣做，無論是圓形的角度、或是矩形特定邊上的長度都可以。

請自由嘗試組出更多特別的形狀 :D
