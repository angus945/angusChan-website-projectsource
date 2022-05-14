---
title: "十五章 修正鋸齒"
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

## 反鋸齒修正

在繪製圖形的過程中，相信各位都有注意到圖形的邊緣會是塊狀的，在視覺上相當不美觀，所以要想辦法將它修正。當我們把畫面放大時可以很清楚的看到的鋸齒。

{{< resources/image "pixel.jpg" "80%" >}}

簡單解釋一下導致邊緣鋸齒原因。這是因為我們的上色方法透過無條件進位 ceil 和範圍限制 saturate 將距離值簡單的分割成兩種數值，透過 0 和 1 來判斷上不上色。

{{< resources/image "ceil.jpg" "50%" >}}

當像素上色只有畫與不畫時，就注定了圖形會有醜陋的鋸齒邊緣。

### SmoothStep

為了避免邊緣鋸齒，我們可以善用距離值來做出平滑的過度，首先要做的就是將原本只有兩種可能的上色，修改為能夠根據距離回傳適當過度值的計算。

回顧一下沒有無條件進位時畫出的圖形，可以看到原本的邊緣有一段在 0 ~ 1 之間的距離過度。

```csharp
return colorDistance(distance);
```

{{< resources/image "smooth_0.jpg" "80%" >}}

利用這段過度就能夠畫出平滑的邊緣了，我們可以使用平滑函數 SmoothStep 取代原本的進位 ceil 達成目的。

{{< resources/image "smooth_1.jpg" "50%" >}}

但我們不需要那麼寬的過度範圍，只需要在邊緣有微小的柔和過度就好，可以為函數所以提供一個適當的數值作為過度範圍。

{{< resources/image "smooth_2.jpg" "50%" >}}

透過平滑函數計算正確的過度值後，再使用插值回傳顏色。

```csharp
fixed4 AntiAliasingColor(float distance)
{
    float aaf = 0.05;
    return lerp(_ShapeColor, _BackgroundColor, smoothstep(-aaf, aaf, distance));
}
```

將上色方法替換為反鋸齒後就能看到平滑的圖形邊緣了，注意現在不需要無條件進位了。

```csharp
float distance = SDF_Example_timelie_Main(uv);
fixed4 color = AntiAliasingColor(distance);
```

{{< resources/image "smooth_3.jpg" "80%" >}}

雖然現在不會再出現邊緣鋸齒，但將 "視角" 放到很近時反而會看到平滑函數的過度範圍。

{{< resources/image "smooth_4.jpg" "80%" >}}

這是因為在上面的計算中我們將過度範圍設置成定值，視角遠時這個範圍過小不會注意到，但當我們離圖形很近時，這個範圍就顯得過大了。

所以實際繪製時我們不應該使用定值作為過度範圍，我們可以透過像素之間計算出的距離值差距作為範圍，當差距大時(畫面遠)使用較大的範圍，反之畫面近時使用較小範圍。

要怎麼取得其他像素計算出的距離值呢 ? 可以透過著色器中的特殊函數 fwidth 做到，這個函數能夠自動插值相鄰像素計算時輸入進去的參數。

將本為定值的過度範圍改為與鄰近像素計算出的距離插值。

```csharp
fixed4 AntiAliasingColor(float distance)
{
    float aaf = fwidth(distance);

    return lerp(_ShapeColor, _BackgroundColor, smoothstep(-aaf, aaf, distance));
}
```

現在就算視角離圖片很接近也依然能有清晰平滑的過度了 !

{{< resources/image "fwidth.jpg" "80%" >}}

以上就是對距離場圖形進行反鋸齒修正的做法。最後再提醒一次，因為反鋸齒的運算會需要透過微小的距離差異作為平滑範圍，這也代表計算中不能有任何進位或捨去等運算，否則會導致反鋸齒計算的效果不如預期。

{{< resources/image "warning.jpg" "80%" >}}
