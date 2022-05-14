---
title: "十一章 動畫方法"
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

## 添加動畫的方法

目前為止，我們使用距離場繪製的圖形都是靜態的，所以下一步就是要讓距離場動起來。

教學這裡將播放動畫的類型歸類成兩種 - 主動以及被動，主動播放指的就是使用者用直接或間接手段控制動畫的撥放，而被動播放指的是閒置狀態下的自主動作。

### 被動播放

被動播放主要依靠的是時間相關的變數，使用 _Time 讓形狀持續運動，或是搭配三角函數產生正盪波型。

首先建立一個回傳不同速度的時間函數。

```csharp
float time_speed(float speed)
{
    return _Time.y * speed;
}
```

在計算距離場之前將 uv 進行旋轉。

```csharp
uv = rotate(uv, time_speed(60));
float distance = SDF_Example_Combination(uv);
```

{{< resources/image "time_0.gif" "50%" >}}

整個形狀都朝同一個方向旋轉太單調了，其實我們可以讓旋轉有不同的層次，只需要在組合距離場時將 uv 以不同速率旋轉。

```csharp
float SDF_Example_Combination(float2 uv)
{
    float outUV = rotate(uv, time_speed(-30));
    //outside distance...

    float inUV = rotate(uv, time_speed(-50));
    //inside distance...    

    return distance;
}
```

{{< resources/image "time_1.gif" "50%" >}}

### 主動播放

顧名思義，需要由使用者主動控制的動畫，主要會依靠插值 lerp 函數來達成，首先在著色器上添加一項 _Anim 屬性並建立變數，範圍由 0 到 1。

```csharp
_Anim ("Anim", Range(0, 1)) = 0
```

```csharp
float _Anim;
```

我們將 _Anim 作為 lerp 的權重輸入，讓特定數值在我們的控制下變動，同樣以旋轉為例。

```csharp
uv = rotate(uv, lerp(-270, 0, _Anim));
```

{{< resources/image "lerp_0.gif" "90%" >}}

當然我們也可以在組合距離場時，根據層次做出不同動態。

```csharp
float SDF_Example_Combination(float2 uv)
{
    float outUV = rotate(uv, lerp(270, 0, _Anim));
    //outside distance...

    float inUV = rotate(uv, lerp(-270, 0, _Anim));
    //inside distance...    

    return distance;
}
```

{{< resources/image "lerp_1.gif" "90%" >}}

在進行主動播放時可以透過 C# 腳本來控制動畫的持續時間，教學這裡就進行省略了。

讓距離場播放動畫的方法主要就是以上兩種，而我們能做的當然不只有旋轉，實際上你可以用動畫控制任何距離場使用到的參數，下一章教學會帶你們了解各種可以透過動畫達成的效果。

### 章節題目

請嘗試用任何方法播出類似效果

{{< resources/image "quest.gif" "50%" >}}
