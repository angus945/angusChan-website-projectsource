---
title: "十七章 進階上色"
date: 2021-07-28T10:20:32+08:00
lastmod: 2021-07-28T10:20:32+08:00
draft: true
keywords: []
description: ""
tags: []
category: ""
author: "angus chan"
featured_image: ""
listable: true
order: 17
similarpagelink: byorder
listable: true

# You can also close(false) or open(true) something for this content.
# P.S. comment can only be closed
comment: true
likecoin: false
toc: true
autoCollapseToc: false
postMetaInFooter: false
hiddenFromHomePage: false
# You can also define another contentCopyright. e.g. contentCopyright: "This is another copyright."
contentCopyright: false
reward: false
mathjax: false
mathjaxEnableSingleDollar: false
mathjaxEnableAutoNumber: false

# You unlisted posts you might want not want the header or footer to show
hideHeaderAndFooter: false

# You can enable or disable out-of-date content warning for individual post.
# Comment this out to use the global config.
#enableOutdatedInfoWarning: false

flowchartDiagrams:
  enable: false
  options: ""

sequenceDiagrams: 
  enable: false
  options: ""

---

標準化空間，大小為 10

## 進階上色

目前為止的距離場圖形只有用到兩種顏色，距離場內和距離場外，不過我們還可以使用更多種顏色來繪製距離場圖形。

### 組合上色

首先我們可以讓不同距離場有各自的顏色，例如紅色的矩形和綠色的圓形，只需要判斷點是在哪個距離場中即可。回到一般的距離場計算，先繪製出兩個疊加圖形的距離。

```csharp
float dA = SDF_Rect(uv, 2);
float dB = SDF_circle(translate(uv, 1), 2);
return combina_add(dA, dB);
```

{{< pathImage "combina_0.jpg" "50%" >}}

複習一下組合疊加是怎麼計算的，我們透過取小值來合併兩個距離場形狀。

```csharp
return min(a, b);
```

因此，如果想讓形狀有各自顏色，只需要在判斷的時候也一併區分要繪製的像素顏色就好。

```csharp
float Combina_color_add(float a, float b, fixed4 colA, fixed4 colB, out fixed4 col)
{
    if(a < b)
    {
        col = colA;
        return a;
    }
    else    
    {
        col = colB;
        return b;
    }
}
```

```csharp
fixed4 colA = fixed4(1, 0, 0, 1);
fixed4 colB = fixed4(0, 1, 0, 1);

fixed4 color;
float distance = Combina_color_add(dA, dB, colA, colB, color);

distance = ceil(distance);
color = lerp(color, _BackgroundColor, saturate(distance));

return color;
```

{{< pathImage "combina_1.jpg" "50%" >}}

可以看到，雖然形狀現在有各自的顏色，但是內部交界處的效果和想像的不同，主要是因為距離場內測的計算不太正確，但是在只有單色時這個問題不會影響結果。

這個問題沒辦法修復，因為內側的交界情況難以預測，所以組合上色通常會是在三維空間中繪製距離場時才使用的，因為三維中不會看到形狀內部的情況。

所以當我們要在二維中使用組合上色時，必須避免兩個發生交界的形狀使用不同顏色。

### 覆蓋上色

和上個上色方法的效果類似，只不過這次是直接將新顏色覆蓋上去，使用距離來插值新顏色和舊 (背景) 顏色就能達到覆蓋的效果。

```csharp
fixed4 colorOverlap(fixed4 overlapColor, fixed4 baseColor, float distance)
{
    return lerp(overlapColor, baseColor, saturate(distance));
}
```

首先將顏色指定為背景，上色時使用形狀的距離一層一層覆蓋上去即可。

```csharp
float dA = SDF_Rect(uv, 2);
float dB = SDF_circle(translate(uv, 1), 2);

fixed4 color = _BackgroundColor;
color = colorOverlap(fixed4(1, 0, 0, 1), color, ceil(dA));
color = colorOverlap(fixed4(0, 1, 0, 1), color, ceil(dB));
```

{{< pathImage "overlap.jpg" "50%" >}}

使用這種做法就不用擔心交界的問題了，唯一的限制只有順序會直接影像結果，後畫的形狀會蓋過先前的所有圖形。

### 計算上色

在前面的章節有提到，我們能夠透過參數對距離場的任何計算進行操作，甚至是顏色也行。再次使用線段舉例，我們可以讓線的兩端在不同顏色間產生過度。

{{< pathImage "calculate_0.jpg" "50%" >}}

同樣使用投影的距離值作為讓色參考，首先讓原本的線段函數回傳投影值。

```csharp
float SDF_line(float2 uv, float2 pointA, float2 pointB, float thickness,
    out float projToLine)
{
    float2 lineDirection = normalize(pointB - pointA);
    float lineLength = length(pointB - pointA);
    **projToLine = dot(uv - pointA, lineDirection);**

    float2 lineNormal = cross(float3(lineDirection.xy, 0), float3(0, 0, 1));
    float dist = lerp
        (
            length(uv - pointA), lerp(abs(dot(uv - pointA, lineNormal)), length(uv - pointB), 
            step(lineLength, projToLine)), step(0, projToLine)
        );           
    
    return dist - thickness;              
}
```

建立一個接收和回傳顏色的線段函數多載，並調用原本的函數取得距離和投影值，將投影的數值除以線段長度取得比例，並使用比例值當作插值的權重。

```csharp
float SDF_Color_line(float2 uv, float2 pointA, float2 pointB, float thickness, 
    fixed4 colA, fixed4 colB, out fixed4 col)
{
    float projToLine;
    float distance = SDF_line(uv, pointA, pointB, thickness, projToLine);

    float lineLength = length(pointB - pointA);

    col = lerp(colA, colB, saturate(projToLine / lineLength));
    return distance;
}
```

最後調用上色的距離場函數繪製線段。

```csharp
fixed4 colA = fixed4(1, 0, 0, 1);
fixed4 colB = fixed4(0, 1, 0, 1);

fixed4 color;
float distance = SDF_Color_line(uv, -5, 5, 1, colA, colB, color);
```

{{< pathImage "calculate_1.jpg" "50%" >}}

而當然和其他修改一樣，計算上色也不局限於線段，實際上可以將任何數值作為插值的權重，像是角度，以圓環為例將弧度作為顏色插值的權重。

```csharp
float SDF_Color_Ring(float2 uv, float radius, float thickness, fixed4 colA, fixed4 colB, 
    out fixed4 col)
{
    float radian = abs(atan2(uv.y, uv.x));
    col = lerp(colA, colB, radian / PI);

    return SDF_Ring(uv, radius, thickness);
}
```

{{< pathImage "calculate_2.jpg" "50%" >}}

### 噪聲上色

使用噪聲計算來替顏色進行微小修改，讓顏色不要那麼單調，不過噪聲的計算已經超出教學的範圍了，所以這裡提供簡單的噪聲算法做為參考。

```csharp
float noise_random(float2 uv) 
{
    return frac(sin(dot(uv, float2(12.9898, 78.233))) * 43758.5453123);
}
```

```csharp
float noise_valueNoise(float2 uv)
{
    float2 i = floor(uv);
    float2 f = frac(uv);

    float a = noise_random(i);
    float b = noise_random(i + float2(1.0, 0.0));
    float c = noise_random(i + float2(0.0, 1.0));
    float d = noise_random(i + float2(1.0, 1.0));

    float2 u = f*f*(3.0-2.0*f);

    return lerp(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}
```

將計算結果作為顏色上的噪點。

```csharp
fixed4 color = _ShapeColor * lerp(0.8, 1.2, noise_valueNoise(uv));
```

{{< pathImage "noise.jpg" "50%" >}}

其實噪聲的數值範圍可以在小一點，這裡設 0.4 的範圍主要還是方便展示而已，實際上 0.1 ~ 0.2 就夠了，你們也可以換個顏色看看，向是棕色或灰色就會產生木質和金屬的質感。

### 貼圖上色

除了單一的顏色以外，我們也可以使用紋理貼圖為距離場著色，而距離場的運算特性同樣也能輕易地做到。首先添加一項 texture 屬性給著色器，並自行放上喜歡的圖片。

```csharp
_SDFTexture ("Texture", 2D) = "white" { }
sampler2D _SDFTexture;
```

再來是建立一像貼圖著色的距離場計算函式，輸入貼圖和形狀參數回傳顏色。

```csharp
fixed4 Texture_SDF_Rect(float2 uv, float2 size, sampler2D tex)
{
    fixed4 color = tex2D(tex, uv);
    
    return color;
}
```

{{< pathImage "texture_0.jpg" "50%" >}}

註 : 圖片拉長的原因是 texture clamp 造成的，不用擔心。

由於空間操作的關係，我們函數計算的 uv 輸入是經過縮放的，因此我們得先將圖片放大回原本的大小。

放大的部分很簡單，在開頭幾章的縮放操作中就有提到了，只需要除以大小即可，不過要注意矩形距離場輸入的大小為直徑，所以還得再次除以二才能將 uv 變回原本的大小。

```csharp
fixed4 Texture_SDF_Rect(float2 uv, float2 size, sampler2D tex, fixed4 baseColor)
{
    float2 mappingUV = uv / size / 2;
    fixed4 color = tex2D(tex, mappingUV);
    
    return color;
}
```

{{< pathImage "texture_1.jpg" "50%" >}}

現在大小正確了但位置不正確，因為 uv 是從空間中心的 (0, 0) 開始的，所以紋理的 uv 運算也會從空間正中心開始，我們得要將 uv 朝正確的方向偏移。

{{< pathImage "texture_2.jpg" "50%" >}}

偏移的部分相信各位還沒忘，要往左下角偏移的話就用加的，只要加上形狀大小即可。

```csharp
float2 mappingUV = (uv + size) / size / 2;
```

{{< pathImage "texture_3.jpg" "50%" >}}

接著只剩一步 - 完成距離場計算，我們的目的是透過貼圖為距離場著色，也代表只有距離場會使用到貼圖的顏色，其他部分都不需要。

如何剔除不需要的部分 ? 只要使用計算出的距離值就可以了，我們可以透過距離直當作上色的遮罩，將不需要的部分過濾掉，對貼圖顏色和背景顏色進行插值就能完成。

```csharp
fixed4 Texture_SDF_Rect(float2 uv, float2 size, sampler2D tex, fixed4 baseColor)
{
    float distance = SDF_Rect(uv, size);
    distance = ceil(distance);

    float2 mappingUV = (uv + size) / size / 2;
    fixed4 color = tex2D(tex, mappingUV);
    
    return lerp(color, baseColor, saturate(distance));
}
```

{{< pathImage "texture_4.jpg" "50%" >}}

大功告成，如此一來我們就能為距離場畫上貼圖了，並且直接和空間操作相容，如果想繪製不同圖形也只需要修改距離場算法即可。

```csharp
fixed4 Texture_SDF_Circle(float2 uv, float radius, sampler2D tex, fixed4 baseColor)
{
    float distance = SDF_circle(uv, radius);
    distance = ceil(distance);

    float2 mappingUV = (uv) / radius / 2;
    fixed4 color = tex2D(tex, mappingUV);
    
    return color;
}
```

{{< pathImage "texture_5.gif" >}}

雖然這樣就很不錯了，但其實可以再更進一步，目前的上色算法是每次計算距離場上色就會強制貼圖顏色蓋上去，因此當上色時遇到半透明貼圖，那他的透明度會沒有效果，所以我們可以將上色計算加入不透明運算，原理就不多解釋了。

```csharp
color = (color * color.a) + (baseColor * (1 - color.a));
```

{{< pathImage "texture_6.gif" >}}

以上就是進階的距離場上色方法，只要搭配進階上色使用又能夠畫出更精緻的圖形了。
