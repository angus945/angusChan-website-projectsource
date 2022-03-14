---
title: "十九章 最終範例"
date: 2021-07-28T10:20:32+08:00
lastmod: 2021-07-28T10:20:32+08:00
draft: false
keywords: []
description: ""
tags: []
category: ""
author: "angus chan"
featured_image: ""
listable: true
order: 19
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

標準化空間，大小為 50

## 最終範例

最後的最後就讓教學帶著各位從頭實作一次更複雜的距離場動畫吧，我們將一次用到各種教學中使用的計算方法，從組合到空間操作、從動畫到進階著色並畫出精美的齒輪動畫。

{{< pathImage "preview.gif" "50%" >}}

### 設置

首先是腳本設置的部分，此篇最終範例會用到的計算函數基本上和先前教到的內容都一致，所以可以直接使用自己編寫的腳本繼續，或是建立一個新的著色器腳本，將範例中使用到的函數複製過來也行。

如果想要直接使用整理過的腳本的話，也下載腳本並直接使用，裡面已經將這篇範例中所有會用到的函數整理起來了。

{{< pathLink "腳本(點開另存新檔)" "tutorial_finial.shader" >}}

- 標準化空間 spaceNormalize
- 噪聲計算 noise_random, noise_valueNoise
- 距離場上色 colorDistance
- 距離場組合 combina_add, combina_mask, combina_cull, combina_fusion
- 空間操作 translate, rotate, scale, mirror(normal), radial
- 距離場函數 SDF_circle, SDF_Ring, SDF_Sector, SDF_RingSector, SDF_Rect, SDF_ringRectangles

以上就是使用到的函數，接下來將開始最終範例教學的正文

```csharp
float2 uv = spaceNormalize(i.uv, 50);
```

## 齒輪

首先是齒輪，相信各位應該很疑惑為什麼要畫齒輪動畫卻沒有在設置中提到齒輪距離場，這是因為我們要對計算過程進行一些修改，讓齒輪看起來更美觀。

```csharp
float gear(float2 uv, float2 radius, float thickness, float teethAmount, float2 teethSize)
{

}
```

```csharp
float distance = gear(uv, 30, 4, 20, 2);

return colorDistance(ceil(distance));
```

組合的部分，一樣還是透過圓環和矩形環，但是計算有些微改動，舊的圓環計算中為了將厚度中心維持在半徑的位置，所以會將厚度朝兩個方向疊加。

但是在齒輪距離場中為了確保後續計算不會受到厚度影響，所以我們得將厚度改成向內疊加。

```csharp
float ring = SDF_Ring(uv, radius - thickness / 2, thickness);

return ring;
```

{{< pathImage "gear_0.jpg" "50%" >}}

接下來是將輪齒擺放上去，輪齒的擺放位置半徑為齒輪厚度加上齒輪深度的一半。

```csharp {hl_lines=[3,4,6]}
float ring = SDF_Ring(uv, radius - thickness / 2, thickness);

float teethRadius = radius + teethSize.x * 0.5;
float teeth = SDF_ringRectangles(uv, teethRadius, teethAmount, teethSize);

return combina_add(ring, teeth);
```

{{< pathImage "gear_1.jpg" "50%" >}}

以上就和原本的齒輪計算差不多，但是菱菱角角看起來不夠美觀，所以接下來我們要用到進階的部分來進行美化。

首先是輪齒的部分，矩形的角落太過銳利了，所以要使用進階繪製中教到的膨脹來讓他有圓角，為了避免膨脹對輪齒大小造成影響，我們會在膨脹前預先減去輪齒的大小。

```csharp
float round = teethSize * 0.5;
float teeth = SDF_ringRectangles(uv, teethRadius, teethAmount, teethSize - round) - round;
```

{{< pathImage "gear_2.jpg" "50%" >}}

接著是輪齒和圓環的交界處，直接的疊加組合讓人感覺太堅硬，所以我們可以透過組合中的融合函數讓它們有更平滑的交界。

```csharp
return combina_fusion(ring, teeth, 1);
```

{{< pathImage "gear_3.jpg" "50%" >}}

更加美觀的齒輪完成了，而輪齒朝內的齒輪也只需要將部分計算反轉而已。

```csharp {hl_lines=[3,5]}
float internalGear(float2 uv, float2 radius, float thickness, float teethAmount, float2 teethSize)
{
    float ring = SDF_Ring(uv, radius + thickness / 2, thickness);

    float teethRadius = radius - teethSize.x * 0.5;
    float round = teethSize * 0.5;
    float teeth = SDF_ringRectangles(uv, teethRadius, teethAmount, teethSize - round) - round;
    
    return combina_fusion(ring, teeth, 1);
}
```

{{< pathImage "internalGear.jpg" "50%" >}}

## 主要結構

有了需要的距離場函數後就可以開始繪製我們的圖形了，先畫出圖形裡的主要形體 - 由十個齒輪組合出的結構，最後再添加額外的裝飾。

首先是在正中心的齒輪，為了方便計算使用我們將輪齒大小在函數最上面設置為常數，繪製的半徑為 10 而輪齒數量為 16。

```csharp
fixed4 finialExample_gears(float2 uv, out float distance)
{
    const float2 teethSize = 1.1;

    float2 g1uv = uv;
    float g1 = gear(g1uv, 10, 2, 16, teethSize);

    distance = g1;

    return colorDistance(ceil(distance));
}
```

```csharp
float gear;
fixed4 gearColor = finialExample_gears(uv, gear);

return gearColor;
```

{{< pathImage "main_0.jpg" "50%" >}}

接著是放在旁邊的小齒輪，為了方便計算半徑和輪齒數量都為原本的一半，放置位置的計算就將半徑相加後，再加上輪齒大小即可。

```csharp
float2 g2uv = uv;
g2uv = translate(g2uv, float2(17, 0));
float g2 = gear(g2uv, 5, 2, 8, teethSize);

//float distance...
distance = combina_add(distance, g2);
```

{{< pathImage "main_1.jpg" "50%" >}}

現在大小齒輪的輪齒重疊了，為了讓他們能夠正常咬合得給小齒輪添加基本的旋轉角度，角度計算也很簡單，每個輪齒間格角度的一半 : 360 / 輪齒數量 / 2，也就是 22.5。

```csharp {hl_lines=[2]}
g2uv = translate(g2uv, float2(17, 0));
g2uv = rotate(g2uv, 22.5);
float g2 = gear(g2uv, 5, 2, 8, teethSize);
```

{{< pathImage "main_2.jpg" "50%" >}}

右側的齒輪有了，如果要在其他角度也擺放該怎麼辦 ? 當然是使用放射狀分割，簡單的分割就能夠複製出另外三個方向的齒輪。

```csharp {hl_lines=[1]}
g2uv = radial(g2uv, 4);
g2uv = translate(g2uv, float2(17, 0));
g2uv = rotate(g2uv, 22.5);
float g2 = gear(g2uv, 5, 2, 8, teethSize);
```

{{< pathImage "main_3.jpg" "50%" >}}

呈現這種結果的原因是分割從角度零度開始的，所以小齒輪的下半部會被切掉，為了避免這點我們可以在分割前後進行旋轉。

```csharp {hl_lines=[1,3]}
g2uv = rotate(g2uv, -45);
g2uv = radial(g2uv, 4);
g2uv = rotate(g2uv, 45);
g2uv = translate(g2uv, float2(17, 0));
```

{{< pathImage "main_4.jpg" "50%" >}}

小齒輪也有了，接下來換第二圈的齒輪，和中心的齒輪大小相同，透過半徑計算偏移位置後繪製，並同樣使用放射分割複製成四份。

```csharp
float2 g3uv = uv;
g3uv = radial(g3uv, 4);
g3uv = translate(g3uv, 17);
float g3 = gear(g3uv, 10, 2, 16, teethSize);

distance = combina_add(distance, g3);
```

{{< pathImage "main_5.jpg" "50%" >}}

最後是外圈的朝內齒輪，粗略估計齒輪半徑大概為 36、厚度 5 而輪齒數量為 48 齒，同樣為了和其他齒輪正確咬合需要計算基礎旋轉量 360 / 48 / 2 = 3.75。

```csharp
float2 g4uv = uv;
g4uv = rotate(g4uv, 3.75);
float g4 = internalGear(g4uv, 36, 5, 48, teethSize);

distance = combina_add(distance, g4);
```

{{< pathImage "main_6.jpg" "50%" >}}

### 旋轉

齒輪結構現在組裝完成了，接著我們要讓它旋轉起來，透過國小數學輪齒數量和轉速成反比就能夠計算齒輪之間的相對速度。

首先為了統一旋轉速度，我們將數度在函數最上面用常數宣告，並和當前時間計算出旋轉時間。

```csharp
const float baseSpeed = 20;
float time = _Time.y * baseSpeed;
```

齒輪的輪齒數量由小到大分別為 8、16 和 48，簡單的簡化後可以得出速度比為 6 : 3 : 1 ，我們只需要透過這個比值乘上時間就能獲得各齒輪相應的轉速。

```csharp {hl_lines=[1,4,7,10]}
g1uv = rotate(g1uv, time * 3);
float g1 = gear(g1uv, 10, 2, 16, teethSize);

g2uv = rotate(g2uv, -time * 6);
float g2 = gear(g2uv, 5, 2, 8, teethSize);

g3uv = rotate(g3uv, time * 3);
float g3 = gear(g3uv, 10, 2, 16, teethSize);

g4uv = rotate(g4uv, time * 1);
float g4 = internalGear(g4uv, 36, 5, 48, teethSize);
```

{{< pathImage "main_7.gif" "50%" >}}

每個齒輪都在固定位置，使用對應的速率轉動的話視覺上還是略顯單調，所以我們可以對基礎 uv 添加一個反向的旋轉速度，讓齒輪內外側整體視覺上感覺朝不同方向轉動。

```csharp {hl_lines=[3]}
float time = _Time.y * baseSpeed;

uv = rotate(uv, -time * 0.7);
```

{{< pathImage "main_8.gif" "50%" >}}

### 上色

現在主要結構的圖形已經完成，我們可以為其上色，首先新建立一個反鋸齒顏色覆蓋的上色函數。

```csharp
fixed4 AAColorOverlap(fixed4 color, fixed4 baseColor, float distance)
{
    float aaf = fwidth(distance);
    return lerp(color, baseColor, smoothstep(-aaf, aaf, distance));
}
```

建立顏色屬性，並到編輯器選擇自己喜歡的顏色，教學這裡以木質和銅鐵作為主要配色方案。

```csharp
_Gears_SmallColor("SmallColor", Color) = (0,0,0,1)
_Gears_BigColor("BigColor", Color) = (0,0,0,1)
_Gears_InternalColor("InternalColor", Color) = (0,0,0,1)
```

```csharp
fixed4  _Gears_SmallColor;
fixed4  _Gears_BigColor;
fixed4  _Gears_InternalColor;
```

接著完成疊加上色

```csharp
fixed4 color = 0;
color = AAColorOverlap(_Main_BigColor, color, g1);
color = AAColorOverlap(_Main_SmallColor, color, g2);
color = AAColorOverlap(_Main_BigColor, color, g3);
color = AAColorOverlap(_Main_InternalColor, color, g4);

return color;
```

{{< pathImage "main_9.jpg" "50%" >}}

顏色有了，但還是過於單一，我們可以再用進階上色中教到的噪聲上色來添加材質感。

```csharp
float g1noise = lerp(0.9, 1.1, noise_valueNoise(g1uv));
float g2noise = lerp(0.9, 1.1, noise_valueNoise(g2uv));
float g3noise = lerp(0.9, 1.1, noise_valueNoise(g3uv));
float g4noise = lerp(0.9, 1.1, noise_valueNoise(g4uv));

fixed4 color = 0;
color = AAColorOverlap(_Gears_BigColor * g1noise, color, g1);
color = AAColorOverlap(_Gears_SmallColor * g2noise, color, g2);
color = AAColorOverlap(_Gears_BigColor * g3noise, color, g3);
color = AAColorOverlap(_Gears_InternalColor * g4noise, color, g4);
```

{{< pathImage "main_10.jpg" "50%" >}}

距離場圖形的主要結構完成了，接下來就是添加前後景裝飾來讓畫面豐富。

## 背景

背景的部分，首先畫個簡單的架子當作結構框架，因為是框架所以需要較寬的厚度。

```csharp
fixed4 finialExample_shelf(float2 uv, out float distance)
{
    distance = SDF_Ring(uv, 33, 10);
    distance = combina_fusion(distance, SDF_Rect(uv, float2(3, 35)), 0.9);
    distance = combina_fusion(distance, SDF_Rect(uv, float2(35, 3)), 0.9);

    return colorDistance(ceil(distance));
}
```

為了看到效果我們到 frag 將回傳的像素顏色替換為框架的顏色。

```csharp
float gear;
fixed4 gearColor = finialExample_shelf(uv, gear);

return shelfColor;
```

{{< pathImage "shelf_0.jpg" "50%" >}}

接著也給框架上色，因為會放在最後方的所以我們上個不明顯的深色即可。

```csharp
_Shelf_Color("Shelf", Color) = (0,0,0,1)

fixed4 _Shelf_Color;
```

```csharp
float noise = lerp(0.9, 1.1, noise_valueNoise(uv));
return AAColorOverlap(_Shelf_Color * noise, 0, distance);
```

{{< pathImage "shelf_1.jpg" "50%" >}}

再來是主結構後方的裝置，稍微有點設計但不需要太複雜，首先一樣是十字的圓環。

```csharp
fixed4 finialExample_rear(float2 uv, out float distance)
{ 
    float2 ringuv = uv;
    distance = SDF_Ring(ringuv, 33, 2);
    distance = combina_fusion(distance, SDF_Rect(ringuv, float2(32, 2)), 0.9);
    distance = combina_fusion(distance, SDF_Rect(ringuv, float2(2, 32)), 0.9);

    return colorDistance(ceil(distance));
}
```

{{< pathImage "rear_0.jpg" "50%" >}}

接下來添加幾個扇形環讓結構看起來穩固點，使用兩大兩小讓畫面看起來有對稱性。

```csharp
distance = combina_fusion(distance, SDF_RingSector(ringuv, 25, 2, 45, 45), 0.8);
distance = combina_fusion(distance, SDF_RingSector(ringuv, 25, 2, 45, 225), 0.8);
distance = combina_fusion(distance, SDF_RingSector(ringuv, 15, 2, 45, -45), 0.8);
distance = combina_fusion(distance, SDF_RingSector(ringuv, 15, 2, 45, -225), 0.8);
```

{{< pathImage "rear_1.jpg" "50%" >}}

接著在環上添加一些長形結構添加豐富度。

```csharp
distance = combina_fusion(distance, SDF_ringRectangles(ringuv, 33, 28, float2(2, 1)) - 0.5, 0.8);
```

{{< pathImage "rear_2.jpg" "50%" >}}

因為十字剛好指在格子裡看起來不美觀，所以繪製前添加一點旋轉量 360 / 28 / 2 = 6.4。

```csharp {hl_lines=[1]}
ringuv = rotate(ringuv, 6.4);
distance = combina_fusion(distance, SDF_ringRectangles(ringuv, 33, 28, float2(2, 1)) - 0.5, 0.8);
```

{{< pathImage "rear_3.jpg" "50%" >}}

並且同樣讓它旋轉起來，速度比主環略快一點。

```csharp
float baseSpeed = 30;
float time = _Time.y * baseSpeed;

float2 ringuv = uv;
ringuv = rotate(ringuv, time);
```

{{< pathImage "rear_4.gif" "50%" >}}

最後為他上色，因為同樣是在主結構後方的裝飾，添加深一點的顏色讓他最為襯托即可。

```csharp
_Rear_Color("Rear", Color) = (0,0,0,1)

fixed4 _Rear_Color;
```

```csharp
float noise = lerp(0.9, 1.1, noise_valueNoise(uv));
return AAColorOverlap(_Rear_Color * noise, 0, distance);
```

{{< pathImage "rear_5.jpg" "50%" >}}

## 外框

最後的結構 - 上層外框，同樣的作為陪襯不需要過於複雜，並且為了避免蓋過主結構，所以用簡單的圓環加上矩形環就可以了。

```csharp
fixed4 finialExample_frame(float2 uv, out float distance)
{
    distance = SDF_Ring(uv, 40, 3);
    distance = combina_fusion(distance, SDF_ringRectangles(uv, 40, 30, 2) - 0.5, 0.8);

    return colorDistance(ceil(distance));
}
```

```csharp
float frame;
fixed4 frameColor = finialExample_frame(uv, frame);

return frameColor;
```

{{< pathImage "frame_0.jpg" "50%" >}}

給外框添加簡單的旋轉動畫，速度緩慢的震盪旋轉。

```csharp
float baseSpeed = -0.05;
float time = _Time.y * baseSpeed;

uv = rotate(uv, sin(time) * 60);
```

{{< pathImage "frame_1.gif" "50%" >}}

上色，因為是在主環前面所以不需要太陰暗，但避免過於搶眼也不需要很鮮豔。

```csharp
_Frame_Color("Frame", Color) = (0,0,0,1)

fixed4 _Frame_Color;
```

```csharp
float noise = lerp(0.9, 1.1, noise_valueNoise(uv));
return AAColorOverlap(_Frame_Color * noise, 0, distance);
```

{{< pathImage "frame_2.jpg" "50%" >}}

## 組合

最後的最最後，所有結構都完成就是要將它們組裝啦 !

回到 frag 裡，使用覆蓋上色的方式組裝起來，記得為了避免奇怪的上色問題要先將距離限制在 0 ~ 1的範圍中，並且使用無條件進位來確保疊加範圍正確。

```csharp
shelf = saturate(shelf);
rear = saturate(rear);
gear = saturate(gear);
frame = saturate(frame);

fixed4 color = _BackgroundColor;
color = lerp(shelfColor, color, ceil(shelf));
color = lerp(realColor, color, ceil(rear));
color = lerp(gearColor, color, ceil(gear));
color = lerp(frameColor, color, ceil(frame));

return color;
```

{{< pathImage "combain.jpg" "50%" >}}

疊加完成，但總覺得少了甚麼 ? 導致圖形看起來就像畫在紙張上一樣...陰影 ! 我們可以為每層結構添加少許的陰影來增加立體感。

首先建立陰影強度的屬性

```csharp
_Shadow("Shadow", Range(0, 1)) = 0.5

float _Shadow;
```

陰影的繪製方法也不難，我們在進階繪圖中就有提到了，是什麼 ? 光暈 ! 只需要將光暈的顏色設為黑色看起來就會和陰影一樣了。為每層的顏色疊加畫上黑色的光暈。

```csharp {hl_lines=[6,13,16,19,22]}
shelf = saturate(shelf);
rear = saturate(rear);
gear = saturate(gear);
frame = saturate(frame);

float shelfShadow = pow(max(shelf, 1 - ceil(shelf)), _Shadow);
float rearShadow = pow(max(rear, 1 - ceil(rear)), _Shadow);
float gearShadow = pow(max(gear, 1 - ceil(gear)), _Shadow);
float frameShadow = pow(max(frame, 1 - ceil(frame)), _Shadow);

fixed4 color = _BackgroundColor;
color = lerp(shelfColor, color, ceil(shelf));
color = lerp(0, color, shelfShadow);

color = lerp(realColor, color, ceil(rear));
color = lerp(0, color, rearShadow);

color = lerp(gearColor, color, ceil(gear));
color = lerp(0, color, gearShadow);

color = lerp(frameColor, color, ceil(frame));
color = lerp(0, color, frameShadow);
```

最後請各自調整自己喜歡的陰影強度、配色和速度參數吧。

{{< pathImage "shadow.gif">}}

### 大功告成

搭拉 ~

{{< pathImage "preview.gif" "50%" >}}

恭喜各位完成了一個精緻的距離場動畫，如果還想添加演出效果就請各自發揮吧 ~

以上就是距離場動畫的最終範例教學。
