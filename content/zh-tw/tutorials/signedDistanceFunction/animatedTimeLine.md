---
title: "十四章 動畫時間"
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
order: 14
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

標準化空間，大小為 10、距離場上色

## 動畫時間軸

上一章學到了讓動畫更流暢的方法，我們還差最後一步 - 讓動畫的播出更戲劇化 !

目前為止，所有動畫都在同一時間用相同的速度播出，在動畫的表現上少了層次感，所以我們可以讓不同的距離場有播放時機的差異，讓動畫只在指定的範圍內完成播放。

{{< pathImage "timeline_0.jpg" "50%" >}}

建立一個函數可以根據輸入時間判斷自身的動畫進度。

```csharp
float time_timeLine(float start, float end, float t)
{

}
```

至於判斷的方法也很簡單，小於動畫起點時回傳 0 大於終點回傳 1，在這之間則是回傳時間軸的進度。

```csharp
if (t < start) return 0;
else if(t > end) return 1;
else
{
    float duration = end - start;
    return (t - start) / duration;
}
```

讓我們畫出兩組動畫進行對照，對照組正常播放，操作組的播放時間在 0.5 到 0.8 之間。

```csharp
float2 c_start = float2(-5, 3);
float2 c_end = float2(5, 3);
float control = SDF_line(uv, c_start, lerp(c_start - 0.001, c_end, _Anim), 1);

float timeline = time_timeLine(0.5, 0.8, _Anim);
float2 start = float2(-5, -3);
float2 end = float2(5, -3);
float operating = SDF_line(uv, start, lerp(start - 0.001, end, timeline), 1); 

float distance = combina_add(control, operating);
```

{{< pathImage "timeline_1.gif" "50%" >}}

成功，最後我們只需要重新整理一次算式，使用 saturate 就能夠有效的控制數值範圍了。

```csharp
float time_timeLine(float start, float end, float t)
{
    float duration = end - start;
    return saturate((t - start) / duration);
}
```

### 演出範例

有了時間軸的功能，現在可以將它套用在距離場動畫上了，教學這裡就先帶各位雕第一個完整的演出動畫，首先為了防止混亂，我們將範例的計算獨立成一個距離場函數。

```csharp
float SDF_Example_timelie_Main(float2 uv)
{
    
}
```

```csharp
float distance = SDF_Example_timelie_Main(uv);
return colorDistance(ceil(distance));
```

依樣從簡單的圓環開始，他的播放時間軸在 0 ~ 0.6 之間，使用旋轉放大入場。

```csharp
float main_t = time_timeLine(0, 0.6, _Anim);
float2 main_uv = scale(uv, lerp(0, 1, ease_easeOutCubic(main_t, 3)));

float2 ringUV = main_uv;
float rinMain_distance = SDF_Ring(ringUV, 8, .2);

float distance = rinMain_distance;
return distance;
```

{{< pathImage "example_0.gif" "50%" >}}

接著我們給他添加旋轉的演出效果。

```csharp {hl_lines=[1,2,4]}
float rinMain_t = ease_easeOutCubic(main_t, 3);
float2 ringUV = rotate(main_uv, lerp(-170, 180, rinMain_t));
float rinMain_distance = SDF_Ring(ringUV, 8, .2);
rinMain_distance = combina_mask(rinMain_distance, filter_round(ringUV, rinMain_t));
```

{{< pathImage "example_1.gif" "50%" >}}

再來添加一個扇形，使用和外環相同的時間，這次透過動畫修改旋轉角度和扇型弧度，快進超出。

```csharp
float rinsec_degree = lerp(0, 30, ease_easeOutCubic(main_t, 3));
float rinsec_angle = lerp(-60, 180, ease_esaeOutBack(main_t, 3));
float rinsec_dis = SDF_RingSector(main_uv, 8, 1, rinsec_degree, rinsec_angle);
```

```csharp
distance = combina_add(distance, rinsec_dis);
return distance;
```

{{< pathImage "example_2.gif" "50%" >}}

還不錯，然後替內側加上隨著時間旋轉的輪齒，使用寬度變大出場，時機比主環晚一點。

```csharp
float gear_t = time_timeLine(.5, .6, _Anim);
float2 gear_uv = rotate(uv, time_speed(5));
gear_uv = radialRadius(gear_uv, 30, 7.7);
float2 gear_size = lerp(float2(0.1, -0.1), float2(.1, .3), gear_t);
float gear_dis = SDF_Rect(gear_uv, gear_size);
```

```csharp {hl_lines=[2]}
distance = combina_add(distance, rinsec_dis);
distance = combina_add(distance, gear_dis);
return distance;
```

{{< pathImage "example_3.gif" "50%" >}}

內側有了，接加來是外側。添加一個繞著主環震盪移動的半環，使用兩個頻率不同的震盪波來讓移動不那麼單調，出場則使用和主環一樣的放大和角度變大。

```csharp
float ouRin_t = ease_easeOutCubic(_Anim, 3);
float2 ouRinA_uv = rotate(main_uv, lerp(-150, 0, ouRin_t));
float ouRin_deg = lerp(0, 15, ouRin_t);
float ouRinA_angle = (sin(time_speed(.1) + 387) + sin(time_speed(-.2) + 561) * 1.2);
ouRinA_uv = rotate(ouRinA_uv, ouRinA_angle);
float ouRinSecA_dis = SDF_RingSector(ouRinA_uv, 8.3, .1, ouRin_deg);

float ou_dis = ouRinSecA_dis;
```

```csharp {hl_lines=[3]}
distance = combina_add(distance, rinsec_dis);
distance = combina_add(distance, gear_dis);
distance = combina_add(distance, ou_dis);
return distance;
```

{{< pathImage "example_4.gif" "50%" >}}

最後，讓我們在環上添加最晚出現的氣泡，使用 easeoutBack 出場，為了避免被其他距離場穿過我們得額外回傳一個圓距離場形作為過濾。

```csharp
float SDF_Example_timeline_bubble(float2 uv, float dist, float angle,
    float radius, float thickness, float t, out float filter)
{
    uv = rotate(uv, angle);
    uv = translate(uv, float2(dist, 0));
    
    float rinA_r = lerp(-.1, radius, ease_esaeOutBack(t, 3));
    filter = SDF_circle(uv, rinA_r);

    return SDF_Ring(uv, rinA_r, thickness);
}
```

在圖形上添加三顆泡泡，把泡泡和過濾分別合併。

```csharp
float buA_t = time_timeLine(0.6, 0.65, _Anim);
float buA_filter;
float buA_dis = SDF_Example_timeline_bubble(uv, 8, 60, 1, .1, buA_t, buA_filter);

float buB_t = time_timeLine(0.62, 0.67, _Anim);
float buB_filter;
float buB_dis = SDF_Example_timeline_bubble(uv, 8, 40, 1, .1, buB_t, buB_filter);

float buC_t = time_timeLine(0.64, 0.69, _Anim);
float buC_filter;
float buC_dis = SDF_Example_timeline_bubble(uv, 8, 20, 1, .1, buC_t, buC_filter);

float bubblesfilter = combina_add(buA_filter, buB_filter);
bubblesfilter = combina_add(bubblesfilter, buC_filter);
float bubblesDistance = combina_add(buA_dis, buB_dis);
bubblesDistance = combina_add(bubblesDistance, buC_dis);
```

最後，先使用剃除將重疊的部分過濾，在將泡泡添加進去。

```csharp
distance = combina_cull(distance, bubblesfilter);
distance = combina_add(distance, bubblesDistance);

return distance;
```

{{< pathImage "example_5.gif" "50%" >}}

距離場的動畫就教學到這邊，剛開始盡量以圓形和扇形為主會比較好發揮，請各位自由創作吧 :D
