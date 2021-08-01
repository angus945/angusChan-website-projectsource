---
title: "十八章 分形繪製"
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
order: 18
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

## 分形

距離場的空間操作性能夠輕易地繪製出分形，我們可以透過不斷迭代的空間操作將簡單的圖形複製成分形結構。教學這邊就使用謝爾賓斯基三角形 Sierpinski triangle 為例進行解說。

{{< pathImage "preview.gif" "50%" >}}

### 謝爾賓斯基三角形

首先解說一下他的結構，首先從一個三角形開始，並在正中間挖空四分之一大小的反三角形，讓將原本的結構分成三等份的小三角形。並接著對小三角形再次執行相同動作，當進行無限次迭代後就能夠獲得謝爾賓斯基三角形。

{{< pathImage "introduction_0.gif" "50%" >}}

雖然說是挖空，但我們其實可以反向用 "組合" 的方式來理解謝爾賓斯基三角形。我們先使用三個小三角形組成一層的解謝爾賓斯基三角形，在用這層組出第二層、接著第三層最終迭代無限次。

{{< pathImage "introduction_1.jpg" "50%" >}}

從組合的方式理解做起來就簡單多了，我們只要不斷繪製三角形距離場就能夠組合出解謝爾賓斯基三角形。

雖然繪製一大堆三角形來組合能達到效果，但是在距離場的世界中我們有更方便的手段可以使用 - 鏡射，使用鏡射將三角形複製三份組成第一層，並再次對整體鏡射出第二層、第三層。

進行數次迭代後最終只需要繪製一次三角形距離場就能夠形成謝爾賓斯基三角形 !

### 三角形

首先回到基本的三角形開始，我們可以使用先前的正多邊形距離場達到目的，繪製一個邊數為三的正三角形，把半徑定在最上方以便使用。

```csharp
fixed4 sierpinskiTriangle(float2 uv)
{
    float radius = 2;

    return SDF_Regular(uv, radius, 3);
}
```

```csharp
float distance = sierpinskiTriangle(uv);

return AntiAliasingColor(distance);
```

{{< pathImage "triangle_0.jpg" "50%" >}}

接著我們要進行鏡射來將三角形複製成三分，至於要沿著哪條軸鏡射呢 ?

假設初始圖形在左上方的話，首先可以沿著水平軸鏡射出下方的三角形，接著是沿著一個 60 度角的軸線鏡射出正右方的三角形，這裡提供一張示意圖幫助你們理解。

{{< pathImage "triangle_1.jpg" "50%" >}}

將鏡像操作添加至 uv 上，不同角度的鏡射軸我們可以透過旋轉函數達到，但要注意鏡射法線的方向，所以實際上是要旋轉 -60 度。

```csharp {hl_lines=[1,2]}
uv = mirror(uv, 0, float2(0, 1));
uv = mirror(uv, 0, rotate(float2(0, 1), -60));

return SDF_Regular(uv, radius, 3);
```

{{< pathImage "triangle_0.jpg" "50%" >}}

嗯，怎麼還是一樣 ? 這是因為鏡射平面的中心和形狀同樣在空間中心，導致鏡射後看起來也一一樣。為了能夠正確鏡射出另外兩個三角形，我們必須添加偏移讓兩個頂點切在投影軸上。

{{< pathImage "triangle_2.jpg" "50%" >}}

首先是 y 軸的偏移，很好理解就是形狀邊長的一半，我們可以直接透過繪製圖形時的半徑用特殊三角形邊長比 1 : sqrt(3) : 2 求出。

至於 x 軸偏移就是形狀的內切圓半徑，我們可以直接將原本的半徑除以二取得。

```csharp {hl_lines=[1,2,3,7]}
float y = radius / 2 * sqrt(3);
float x = -radius / 2;
float2 offset = float2(x, y);

uv = mirror(uv, 0, float2(0, 1));
uv = mirror(uv, 0, rotate(float2(0, 1), -60));
uv = translate(uv, offset);
```

{{< pathImage "fractal_0.jpg" "50%" >}}

成功，我們現在透過鏡射複製出了另外兩個三角形，有了第一層的爾賓斯基三角形後，我們只需要再使用相同的做法複製數次就能夠繪製出分形結構了，透過迴圈執行多次鏡射。

```csharp
for(int i = 0; i < 5; i ++)
{
    uv = mirror(uv, 0, float2(0, 1));
    uv = mirror(uv, 0, rotate(float2(0, 1), -60));
    uv = translate(uv, offset);
}
```

{{< pathImage "fractal_1.jpg" "50%" >}}

嗯...又是哪裡有問題 ? 造成這種狀況的原因是，每當我們進行一層的鏡射後三角形的大小也大了一號，所以再次鏡射時的鏡射軸沒有正確切在頂點上。

要修復這點只需要在鏡射前先將三角形縮小就好，如此一來組合出的三角形就會和先前的一樣大。

```csharp {hl_lines=[3]}
for(int i = 0; i < _Anim * 5; i ++)
{
    uv = scale(uv, 0.5);

    uv = mirror(uv, 0, float2(0, 1));
    uv = mirror(uv, 0, rotate(float2(0, 1), -60));
    uv = translate(uv, offset);
}
```

{{< pathImage "fractal_2.jpg" "50%" >}}

大功告成 ! 我們可以將它旋轉 90 度並把半徑和迭代數量調大，好好觀賞這美麗的圖案。

```csharp
uv = rotate(uv, 90);

//for(){ }
```

{{< pathImage "fractal_3.jpg" "50%" >}}

### 放大再放大

我們是透過數次的迭代組合來繪製出分形的，所以當畫面不段放大時最終還是會出現破綻，那麼要如何做出看似無限放大的效果呢 ?

最簡單的方法就是不斷重複，透過不斷重複播放特定範圍內的放大畫面視覺上就像是不斷地放大，只要透過對時間取餘就能達成不斷重複的效果。

```csharp {hl_lines=[1,3]}
float time = _Time.y * 3;

uv = scale(uv, lerp(1, 2, frac(time)));

uv = rotate(uv, 90);
```

{{< pathImage "anim_0.gif" "50%" >}}

重複放大的效果有了，但由於是從正中心開始放大的所以讓圖形看起來像不斷抽搐，我們可以將圖形向下移一點讓頂點在正中心上，可以避免畫面的抽動

```csharp {hl_lines=[2]}
uv = scale(uv, lerp(1, 2, frac(time)));
uv = translate(uv, float2(0, -radius));
```

{{< pathImage "anim_1.gif" "50%" >}}

縮放正常了，但是因為頂點在正中心所以導致圖形只顯示了一半，我們讓縮放中心往上移一些就能顯示出更大的圖形了

```csharp {hl_lines=[3]}
uv = translate(uv, float2(0, radius * 0.5));
uv = scale(uv, lerp(1, 2, frac(time)));
uv = translate(uv, float2(0, -radius));
```

{{< pathImage "anim_2.gif" "50%" >}}

完成了無限循環的放大動畫，最後可以將距離場空間縮小一點讓分形佔據更大位置

```csharp
float2 uv = spaceNormalize(i.uv, 5);
```

{{< pathImage "anim_3.gif" "50%" >}}

大功告成 ! 恭喜各位完成了謝爾賓斯基三角形 ~
