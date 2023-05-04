---
title: "第八章 空間操作"
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

標準化空間，大小為 10、距離場上色、距離環、游標距離場。

## 更進階的空間操作

除了基本的平移、旋轉和縮放外，距離場空間操作性也讓他只需要增加些微的計算成本，就能夠渲染出更多更複雜的圖像。

### 鏡像

在基本形狀的矩形那裏，我們就有提到空間操作性的 "鏡像"，也就是透過 abs 函數將所有位置都映射到第一象限中，當然這也能直接套用在整個距離場空間中，將空間中所有東西進行鏡像。

建立一個沿著座標軸鏡像的函數，回傳絕對值後的 uv。

```csharp
float2 mirror(float2 uv)
{
    return abs(uv);
}
```

{{< resources/image "mirror_0.jpg" "50%" >}}

將修改套用至距離場空間上就能達到鏡像效果。

```csharp
uv = mirror(uv);
float distance = SDF_circle(uv, 3, mousePos);
```

{{< resources/image "mirror_1.gif" "50%" >}}

只能沿著座標軸鏡像不夠方便，能不能夠沿著任意軸鏡像 ? 當然，為了達成這點我們需要一個鏡像點以及鏡面法線。注意這裡的 mirror 函數是多載歐。

```csharp
float2 mirror(float2 uv, float2 mirrorPoint, float2 mirrorNormal)
{
          
}
```

首先要取得代表鏡面本身的向量，我們透過叉積 corss 函數取得，再來是用於投影的 uv ，計算前先將法線進行標準化以確保後續計算正確。

{{< resources/image "mirrorPlane_0.jpg" "50%" >}}

標準化和取得平面向量。

```csharp {hl_lines=["3-6"]}
float2 mirror(float2 uv, float2 mirrorPoint, float2 mirrorNormal)
{
    mirrorNormal = normalize(mirrorNormal);
    
    float2 mirrorPlane = cross(float3(mirrorNormal.xy, 0), float3(0, 0, 1));
    float2 mirrorUV = uv - mirrorPoint;         
}
```

取得需要的數值後，我們將 uv 投影至平面以及法線上取得分量，並將投影至鏡面法線的分量絕對值以達到特定軸的鏡像效果。

{{< resources/image "mirrorPlane_1.jpg" "50%" >}}

將點投影出至平面和平面法線上。

```csharp
float normalPorj = abs(dot(mirrorUV, mirrorNormal));
float planePorj = dot(mirrorUV, mirrorPlane);
```

我們有了鏡像後的分量，最後將分量乘回各自的投影影軸上，相加完畢就是鏡像後的向量了。

{{< resources/image "mirrorPlane_2.jpg" "50%" >}}

將投影值乘回平面向量和法向量，取得鏡射後的 uv。

```csharp {hl_lines=["0-2"]}
float2 normalPorj = abs(dot(mirrorUV, mirrorNormal)) * mirrorNormal;
float2 planePorj = dot(mirrorUV, mirrorPlane) * mirrorPlane;

return normalPorj + planePorj;
```

```csharp {hl_lines=[1]}
uv = mirror(uv, 0, float2(1, 1));
float distance = SDF_circle(uv, 3, mousePos);
```

{{< resources/image "mirrorPlane_3.gif" "50%" >}}

### 平舖 Tiled

將一個完整的空間，分割成好幾個相同的小塊，我們第一次接觸類似作法時是在距離環那章，透過 frac 函數讓距離在由 0 到 1 的循環之間。

{{< resources/image "tiling_0.jpg" "50%" >}}

而將整個空間平鋪化也一樣，不過這次我們要透過取餘函數 fmod 來達成效果，這樣才有辦法控制每塊 Tile 的大小。

```csharp
float2 tiled(float2 uv, float size)
{
    return fmod(uv, size);
}
```

套用至距離場空間上，每兩格進行一次平鋪化。

```csharp
uv = tiled(uv, 2);
float distance = SDF_circle(uv, 1, 1);
```

{{< resources/image "tiling_1.jpg" "50%" >}}

會產生這種結果的原因是，平鋪化是從空間的中心開始的，每個象限都使用自己的第一格作為平鋪化的參考，導致四個象限出現了四種不同結果。

為了防止這點，我們可以使用位移將不需要看到的部分移出繪製範圍。

```csharp {hl_lines=[1]}
uv = translate(uv, -100);
uv = tiled(uv, 2);
float distance = SDF_circle(uv, 1, 1);
```

{{< resources/image "tiling_2.jpg" "50%" >}}

### 反轉平舖

在上面那張圖中，因為圓形距離場是對稱的，並且放置在採樣格的正中心，所以平舖化的結果才會那麼整齊。但如果形狀不是在採樣格中心的話，繪製時圖形就可能在 tile 邊緣被截斷。

{{< resources/image "tilingInverse_0.jpg" "50%" >}}

為了修正這點，可以將特定格中的 uv 反轉，讓他能和相鄰 tile 連接。

取得平鋪化的 uv 以及 tile 的座標，座標只需要用除的就可以取得，因為不需要浮點的部分所以使用 floor 函數無條件捨去。

```csharp
float2 tiledInverse(float2 uv, float size)
{
    float2 uvPosition = floor(uv / size);
    float2 tiledUV = tiled(uv, size);
}
```

接著取餘來判斷當格是奇數還是偶數，並將數值反轉就能不斷循環。

{{< resources/image "tilingInverse_1.jpg" "50%" >}}

使用 fmod 函數對 2 取餘，判斷當前是在奇數還是偶數格中，透過將 uv 減去格子的大小達成反轉。

```csharp
float2 oddEven = fmod(uvPosition, 2); 
if(oddEven.x == 0)
{
    tiledUV.x = size - tiledUV.x;
}
return tiledUV;
```

套用空間修改看看效果。

```csharp
uv = tiledInverse(uv, 2);
```

{{< resources/image "tilingInverse_2.jpg" "50%" >}}

最後我們將 y 軸反轉補上就大功告成 !

```csharp
tiledUV.x = lerp(size - tiledUV.x, tiledUV.x, oddEven.x);
tiledUV.y = lerp(size - tiledUV.y, tiledUV.y, oddEven.y);

return tiledUV;
```

{{< resources/image "tilingInverse_3.jpg" "50%" >}}

### 放射狀

其實與平鋪類似，只不過鋪的方式是放射狀的，我們將透過對角度取餘來達成這點。

首先我們建立一個放射狀函數，輸入 uv 和數量，為了測試所以先回傳 uv 換算出的弧度。

```csharp
float2 radial (float2 uv, float amount)
{
    float radian = atan2(uv.y, uv.x);
    return radian;
}
```

```csharp
//in frag
uv = radial(uv, 5);
return uv.xxxx;
```

{{< resources/image "radial_0.jpg" "50%" >}}

因為 atan2 函數會使用正負值來表示兩個角度的方向，所以我們要透過它將弧度它轉換成 0 ~ 6.28 的範圍，方便之後計算。將弧度小於 0 的部分映射到 3.14 ~ 6.28的範圍。

```csharp
#define PI2 6.28318530718
```

```csharp
if(radian < 0)
{
    radian = PI2 + radian;
}
```

{{< resources/image "radial_1.jpg" "50%" >}}

弧度計算完畢之後，我們要使用取餘對弧度進行平鋪化。首先是計算放射狀數量和 PI 的比例，再透過取得的數值對弧度取餘。

```csharp
float radials = PI2 / amount;
float radial = fmod(radian, radials);
return radial;
```

{{< resources/image "radial_2.jpg" "50%" >}}

可以看到現在每隔一段弧度，就會重新循環一次，最後一步只需要將弧度再換算回 uv。

我們使用 sincos 函數將弧度換算回向量，要注意的是三角函數換算出的向量是標準化的，所以要再乘回原本的長度確保結果正確，完成放射狀的空間操作。

```csharp
float2 radialUV = 0;
sincos(radial, radialUV.y, radialUV.x);

return radialUV * length(uv);
```

```csharp
//in frag
uv = radial(uv, 5);
return fixed4(uv.xy, 0, 1);
```

{{< resources/image "radial_3.jpg" "50%" >}}

最後再將它套用至距離場上

```csharp {hl_lines=[1]}
uv = radial(uv, 5);                
float distance = SDF_Rect(uv, 1, mousePos, 0);
```

{{< resources/image "radial_4.gif" "50%" >}}

放射同樣會造成邊緣截斷，所以我們也要將它進行反轉修正。建立一個新函數，將完本的弧度運算複製過來，並增加一個取得放射格數的計算。

```csharp {hl_lines=[1,9]}
float2 radialInverse (float2 uv, float amount)
{
    float radian = atan2(uv.y, uv.x);

    radian = lerp(radian, PI2 + radian, step(radian, 0));

    float radials = PI2 / amount;
    float radial = fmod(radian, radials);
    float radialNum = floor(radius / radials);
}
```

然後和平鋪反轉時一樣判斷奇偶數並反轉弧度，最後再轉換回 UV。

```csharp {hl_lines=["1-2"]}
float oddEven = fmod(radialNum, 2); 
radial = lerp(radial, radials - radial, oddEven);

float2 radialUV = 0;
sincos(radial, radialUV.y, radialUV.x);    
return radialUV * length(uv);
```

```csharp
uv = radialInverse(uv, 6);
```

{{< resources/image "radialInverse.gif" "50%" >}}

### 波動

最後來個簡單的操作，透過 sin 函數讓空間產生震盪的波動。

```csharp
float2 wobble(float2 uv, float time, float2 frequency, float2 strength)
{
    float2 wobbleOffset = float2(uv.x + uv.y, uv.x - uv.y);
    float2 wobble = sin((time + (wobbleOffset)) * frequency) * strength;
    return uv + wobble;
}
```

```csharp
uv = wobble(uv, _Time.y , 5, .05);
float distance = SDF_Rect(uv, 3, 0, 30);
```

{{< resources/image "wobble.gif" "50%" >}}

此章教學提供了幾種進階的空間操作，而這些操作也是可以互相疊加的，例如平鋪化後每格再進行放射狀。

```csharp
uv = translate(uv , -1000);
uv = tiledInverse(uv, 3);

float distance = SDF_Rect(radialInverse(uv, 6) , .5, 2, 60);
distance = min(distance, SDF_circle(mirror(uv, 0, float2(1, 0)), 1, float2(.5, 0)));
```

{{< resources/image "example.jpg" "50%" >}}

無論是基本的平移旋轉或是此篇的平鋪放射，它們都屬於空間操作，如果將他們對初始的 uv 進行修改，那麼影響的就是整個空間，如果將修改隔離在單一的距離場中，那麼麼影響就只會在特定形狀身上。而當然的，空間操作的順序也會影響結果。

以上提供幾項在距離場中進行空間操作的方法，當然實際上能做到的操作有更多，剩下的就請自行摸索吧 ~
