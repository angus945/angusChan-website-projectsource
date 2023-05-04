---
title: "第九章 進階形狀"
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

## 更多進階形狀

目前為止，扣掉使用組合情況我們也只有三種形狀距離場，但有了進階的空間操作後，我們就能畫出更複雜的形狀了。

### 扇形

扇形，簡單來說就是將圓形剔除掉多餘的角度。我們先建立一個函數接收 uv、半徑以及開闊度數，將度數轉換成弧度，再來是將 uv 標準化取得方向。

```csharp
float SDF_Sector(float2 uv, float radius, float degree)
{
    float rectorRadian = degree * Deg2Rad;

    float2 uvdir = normalize(uv);
}
```

首先我們要做的是判斷 uv 是不是在扇形弧度範為之內。

標準化向量的 x 分量就是朝 x 軸進行點積投影的結果，也是 cos(theta) 會產生的數值，我們可以透過這點來判斷 uv 是不是在弧度範圍內。

{{< resources/image "sector_0.jpg" "50%" >}}

使用形弧度的 cos 值與標準化 uv 的 x 值進行判斷。

```csharp {hl_lines=[7,8]}
float SDF_Sector(float2 uv, float radius, float degree)
{
    float rectorRadian = degree * Deg2Rad;

    float2 uvdir = normalize(uv);

    if(uvdir.x > cos(rectorRadian)) return 0;
    else return 1;
}
```

```csharp
float distance = SDF_Sector(uv, 5, 30);
return distance;  
```

{{< resources/image "sector_1.jpg" "50%" >}}

取得正確的扇形範圍後，我們要把距離計算補回去，扇形的距離就是半徑而已。

```csharp
if(uvdir.x > cos(rectorRadian)) 
{
    return length(uv) - radius;
}
else 
{
    return 1;
}
```

{{< resources/image "sector_2.jpg" "50%" >}}

扇形本身的距離計算完成了，接下來我們要計算兩側的硬邊的距離，側邊就和之前線段的計算一樣，唯一不同的是距離計算只有在形狀單側。

首先我們要取得側邊的向量，由於我們已經有弧度了，所以只需要使用 sincos 函數取得就好。

```csharp {hl_lines=[7,8]}
if(uvdir.x > cos(rectorRadian)) 
{
    return length(uv) - radius;
}
else
{    
    float3 edgeDir = 0;
    sincos(rectorRadian, edgeDir.y, edgeDir.x);
}
```

再來就是將 uv 投影至側邊向量上，並根據投影大小判斷要使用哪部分的距離值，這部分的計算和線段大同小異，所以就不多贅述。

```csharp {hl_lines=["5-19"]}
else
{
    float3 edgeDir = 0;
    sincos(rectorRadian, edgeDir.y, edgeDir.x);
    float projToEdge = dot(uv, edgeDir);

    if(projToEdge < 0)
    {
        return length(uv);
    }
    else if(projToEdge > radius)
    {
        return length(uv - edgeDir * radius);
    }
    else
    {
        float2 edgeNormal = cross(edgeDir, float3(0, 0, 1));
        return abs(dot(edgeNormal, uv));
    }
}
```

{{< resources/image "sector_3.jpg" "50%" >}}

現在上半部的計算正確了，因為扇形是對稱的，所以下半部只需要透過鏡像操作就可以完成。

```csharp {hl_lines=[3]}
else
{
    uv = mirror(uv, 0, float2(0, 1));
    
    float3 edgeDir = 0;
    sincos(rectorRadian, edgeDir.y, edgeDir.x);
}
```

{{< resources/image "sector_4.jpg" "50%" >}}

至於要將扇形放在不同位置或是轉向不同角度，只需要事先完成操作就好，這也是為甚麼我一開始省略掉這部分，將角度這項元素加入扇形計算只會讓情況更複雜。

```csharp
float SDF_Sector(float2 uv, float2 offset, float radius, float angle, float degree)
{
    uv = translate(uv, offset);
    uv = rotate(uv, angle);
    return SDF_Sector(uv, radius, degree);
}
```

{{< resources/image "sector_5.jpg" "50%" >}}

### 正多邊形

相信一些人應該在前幾篇的進階空間操作中就對正多邊形有想法了，沒錯，就是放射狀平鋪 ! 接下來教學會帶各位真正實作一次正多邊形的距離場。

首先回到放射函數那裡，我們要讓他回傳其他必要的參數以利後續計算 - 表面法線

{{< resources/image "regular_0.jpg" "50%" >}}

讓放射函數傳出表面法線，使用 out 傳出放射平餔一半角度時產生出的向量，並另外建立一個和原本一樣不需要 out 的多載。

```csharp {hl_lines=[1, 12]}
float2 radial (float2 uv, float amount, out float2 radialDirection)
{
    float radian = atan2(uv.y, uv.x);

    radian = lerp(radian, PI2 + radian, step(radian, 0));

    float radials = PI2 / amount;
    float radial = fmod(radian, radials);

    float2 radialUV = 0;
    sincos(radial, radialUV.y, radialUV.x);    
    sincos(radials * 0.5, radialDirection.y, radialDirection.x);

    return radialUV * length(uv);
}
```

```csharp
//修正的多載，避免原本調用函數的地方出錯
float2 radial (float2 uv, float amount)
{
    float2 _;
    return radial(uv, amount, _);
}
```

在多邊形計算前先將 uv 放射平餔，並且接收表面法線。

```csharp
float SDF_Regular(float2 uv, float radius, float edgeAmount)
{
    float2 edgeNormal;
    uv = radial(uv, edgeAmount, edgeNormal);
}
```

然後我們只需要將 uv 投影至法線上，就能夠取得與多邊形表面的距離了。

{{< resources/image "regular_1.jpg" "50%" >}}

將 uv 投影至表面法線，並像圓形計算一樣減去多邊形半徑。

```csharp
float SDF_Regular(float2 uv, float radius, float edgeAmount)
{
    float2 edgeNormal;
    uv = radial(uv, edgeAmount, edgeNormal);

    float projToNormal = dot(uv, edgeNormal);
    return projToNormal - radius;
}
```

```csharp
float distance = SDF_Regular(uv, 3, 5);
```

{{< resources/image "regular_2.gif" "50%" >}}

大功告成 ? 不對，從圖片中看的出來，三角形很明顯超出我們要的半徑了。

造成這種錯誤的原因是，因為我們距離計算方法是取得表面距離後直接減去半徑，半徑計算出的結果變成中心點到最近表面的距離，也就是形狀的內切圓。

{{< resources/image "regular_3.jpg" "50%" >}}

正確的計算中，半徑應該要是正多邊形的外切圓，為了修正這點我們必須先將原本的半徑投影到表面法線上，這樣才能取得正確的半徑。

{{< resources/image "regular_4.jpg" "50%" >}}

將建立一個 x 為半徑的向量投影到法線上，並乘上原本的半徑，完成正確的表面距離計算。

```csharp {hl_lines=["6-9"]}
float SDF_Regular(float2 uv, float radius, float edgeAmount)
{
    float2 edgeNormal;
    uv = radial(uv, edgeAmount, edgeNormal);

    float projRadius = dot(float2(1, 0), edgeNormal * radius);
    float edgeDistance = dot(uv, edgeNormal) - projRadius;

    return edgeDistance;
}
```

{{< resources/image "regular_5.gif" "50%" >}}

以上教了額外幾種進階形狀，有了這些形狀又組合出更多效果了，如果還想知道怎麼畫出更多形狀的話，這裡提供一個參考資料。

[Inigo Quilez](https://www.iquilezles.org/www/articles/distfunctions2d/distfunctions2d.htm)

### 章節題目

多邊形的部分還有一步驟沒完成，你們知道是什麼的 ~

{{< resources/image "quest.gif" "50%" >}}

在來，請嘗試用到本章為止教到的部分，自由發揮 :D
