---
title: "【日誌】自己寫一個 One last kiss 的風格渲染"
date: 2021-10-24
lastmod: 2023-02-07

draft: false

description: "嘗試實現了漂亮的 One last kiss 濾鏡渲染"
tags: [shader, post-processing]

socialshare: false

## image for preview
feature: "/devlog/technical/onelastkiss-filter-effect/featured.jpg"

## image for open graph
og: "/devlog/technical/onelastkiss-filter-effect/featured.jpg"

## when calling "resources" shortcode, well link to static folder with this path 
resources: /devlog/technical/onelastkiss-filter-effect/

## customize page background
# background: [watercolor-A] 

## listout with recommand, new and all pages
listable: [recommand, all]
---

<!-- https://home.gamer.com.tw/creationDetail.php?sn=5298650 -->

之前在網路上看到一篇用 Photoshop 製作 One last kiss 專輯濾鏡的教學文章，感覺很有趣所以研究了一下原理，還在 Unity 中實現了相似的渲染效果。

<!--more-->

## 成果展示

照慣例先上成果～

{{< youtube "XZxL1sCshnk" >}}

&nbsp;

我用了兩種方式來實現這個效果，「邊緣檢測」與「線稿提取」。

**邊緣檢測**

研究後處理 Shader 時看到比較多的方法，用卷積矩陣做判斷，透過周圍像素的顏色、深度、方向差距來判斷物體邊緣。

**線稿提取**

在參考資料中看到的，透過清除色調和色塊膨脹的方式提取出線條，主要花時間在理解原理上，程式碼與前者相比也簡短許多。

原本只打算做邊緣檢測的，因為我以為線稿提取只有賽路路的畫風會有效，但事實上任何圖像都行，還好最後沒有放棄，得到了新的技巧和更漂亮的結果。

不廢話，來解說原理和算法吧～

### 邊緣檢測 

去年就研究過邊緣檢測的算法了，但那時還沒完全懂，剛好趁機會再重新理清原理。透過一個 3x3 的九宮格卷積矩陣 (Kernel Convolution) 進行計算，每個格子都有各自的權重，強度根據要計算的目標做調整。

邊緣檢測的 Kernel 叫做索伯算子 (Sobel operator)，水平的檢測長這樣，垂直的就是轉 90 度。

{{< resources/image "edge-detect-1.jpg" "80%" >}}

把原始圖片輸入進去，當兩側顏色差距過大，一正一負下就會出現像是輪廓一樣的結果。

```hlsl
float colorSobel(float2 uv)
{
    float x = 0;
    float y = 0;
    float2 texelSize = _MainTex_TexelSize;

    x += tex2D(_MainTex, uv + float2(-texelSize.x, -texelSize.y)) * -1;
    x += tex2D(_MainTex, uv + float2(-texelSize.x, 			  0)) * -2;
    x += tex2D(_MainTex, uv + float2(-texelSize.x,  texelSize.y)) * -1;

    x += tex2D(_MainTex, uv + float2( texelSize.x, -texelSize.y)) *  1;
    x += tex2D(_MainTex, uv + float2( texelSize.x, 			  0)) *  2;
    x += tex2D(_MainTex, uv + float2( texelSize.x,  texelSize.y)) *  1;

    y += tex2D(_MainTex, uv + float2(-texelSize.x, -texelSize.y)) * -1;
    y += tex2D(_MainTex, uv + float2(			0, -texelSize.y)) * -2;
    y += tex2D(_MainTex, uv + float2( texelSize.x, -texelSize.y)) * -1;

    y += tex2D(_MainTex, uv + float2(-texelSize.x,  texelSize.y)) *  1;
    y += tex2D(_MainTex, uv + float2(			0,  texelSize.y)) *  2;
    y += tex2D(_MainTex, uv + float2( texelSize.x,  texelSize.y)) *  1;

    return sqrt(x * x + y * y);
}
```

{{< resources/image "edge-detect-2.gif" "80%" >}}

單純色差產生的邊緣還不夠，有些相同顏色的交界會無法顯示，所以我也用 Depth Buffer 的深度差和 Normal Buffer 法線方向差距檢測邊緣。

深度差就是相鄰像素的深度相減，基本上會產生生度差距就代表一定是物體邊緣。

{{< resources/image "edge-detect-3.gif" "80%" >}}

方向差距就是和相鄰的像素法線做內積投影的結果數值。

{{< resources/image "edge-detect-4.gif" "80%" >}}

因為各自算法的結果有些差異，所以最後要再把三種數值乘上權重，並用 Pow 把多餘的噪點線條抹除，完成混和的邊緣檢測。

{{< resources/image "edge-detect-5.gif" "80%" >}}

到這裡就完成線條的部份了，接下來就是上色部份，One Last Kiss 還有一個漂亮的漸層效果。

為了簡單我只用兩種顏色的插值而已，基本上就是把畫面 uv 當插值參考，如果要旋轉的話，弄出一個旋轉角度的向量，把 UV 投影上去就行了，拿投影結果當插值權重。

```hlsl
fixed4 gradualColor(float2 uv)
{                
    float radian = _angle * deg2rad;
    float2 projLine = float2(cos(radian), sin(radian));      
    float2 pos = (uv - 0.5) * 2;   
    float value = abs(dot(projLine, pos));
            
    fixed4 gradual = lerp(_colorStart, _colorEnd, value);
    return gradual;
}
```

{{< resources/image "colored-1.gif" "80%" >}}

接著就把漸層顏色混上線條，剩下部份填上背景顏色。不過單純拿白色當背景有點刺眼，所以我去素材庫找了一張紙質的 Texture 當作背景，也提昇一點畫面質感。

```hlsl
fixed4 oneLastKiss_edgeDetect(float2 uv)
{
    fixed4 gradual = gradualColor(uv);
    float edge = edgeValue(uv);
    fixed4 backGround = tex2D(_backGruondTex, uv);
    fixed4 edgeColor = lerp(backGround, gradual, edge);

    fixed4 linearDepth = Linear01Depth(tex2D(_CameraDepthTexture, uv).r);
    float depthAttenuation = pow(linearDepth, _attenuation);
    return lerp(edgeColor, backGround, depthAttenuation);
}
```

{{< resources/image "edge-detect-result.jpg">}}

邊緣檢測的成果

{{< youtube "u0FhDMMlR7Y" >}}

&nbsp;

### 線稿提取

依照參考資料中的作法提取出現條，這個名子是查詢資料時發現的，所以就沿用吧 :D

首先是去除飽和度和負片效果。去飽和，就是把畫面轉成灰階的意思，可以直接 RGB 值相加除三，至於負片就是 1 - RGB。

```hlsl
float colorValue(float2 uv)
{
    fixed4 col = tex2D(_MainTex, uv);
    float grayscale = (col.r + col.g + col.b) / 3;
    float negative = 1 - grayscale;
    return negative;
}
```

{{< resources/image "line-capture-1.jpg" "80%" >}}

{{< resources/image "line-capture-2.jpg" "80%" >}}

參考教學中有這一步驟，但因為計算方法有些不同，在這裡沒有效我就跳過了。

花最多時間研究的步驟，這個濾鏡的效果是取周圍像素中的最小數值，會產生類似塗抹的效果，並讓色塊稍微膨脹。

{{< resources/image "line-capture-3.gif" "80%" >}}

然後！下一步是重點，處理過程就是從這步驟取出線條的。因為 PS 濾鏡效果會自動運算的關係，所以我花了一點時間思考過程中發生的事。

由於濾鏡本身的過濾算法，加上最小值的膨脹效果，如果用把膨脹後的結果減去原始圖樣，就會剩下多餘膨脹出來的部份，取得線條。

{{< resources/image "line-capture-4.gif" "80%" >}}

但因為兩個值還是很接近，所以減出來的線條強度會很弱，要再另外乘上增強強度。

{{< resources/image "line-capture-5.gif" "80%" >}}

然後就是上色！

{{< resources/image "line-capture-result.jpg">}}

成果如下

{{< youtube "XZxL1sCshnk" >}}

&nbsp;

## 感謝閱讀

沒有 PhotoShop 怎麼辦？自己寫一個畫面處理重現就好了 :P

最終結果我覺得比起一開始的邊緣檢測，線稿提取大勝，不只程式短很多，效果也更勝一籌。
邊緣檢測的線條太粗了，而且過程中產生的噪點線條很難看，用 pow 稀釋掉結果又讓線條感覺太銳利。

但線稿提取就沒這問題，透過色塊膨脹的方法取得線條，再用乘的增強強度，造點在遠處還產生意料之外的效果，不需要多修正。老實說我做到最後才想通原理，最小值那裡查不少資料才搞懂，之前完全沒想到能用這種方始提取線條，學到了學到了。

就醬，能量又回復了不少，感謝偉大的計算機圖形學

原始檔我上傳到這裡，對內容有興趣或想自己在編輯器裡走走都可以載來玩，然後我把 FPS Controller 寫的好一點了，不然上次那個手感真的有夠糟www

https://github.com/angus945/One-last-kiss-style-Rendering

### 參考資料

[【密技】教你做出香香的 One last kiss 專輯風濾鏡](https://forum.gamer.com.tw/C.php?bsn=60076&snA=6552964)

[How Blurs & Filters Work - Computerphile](https://www.youtube.com/watch?v=C_zFhWdM4ic)

[Finding the Edges (Sobel Operator) - Computerphile](https://www.youtube.com/watch?v=uihBwtPIBxM)

### 補充資料

[關於去飽和以及加亮顏色](https://forum.gamer.com.tw/C.php?bsn=60602&snA=3980&to=2)

[【教學】Unity HDRP 使用 Volume 自定義 Post Process 以及多 Pass 實現方法](https://home.gamer.com.tw/artwork.php?sn=5300986)