---
title: "【日誌】把物體投影到背景上"
date: 2021-08-22
lastmod: 2023-02-07

draft: true

description:
tags: [shader, post-processing]

socialshare: false

## image for preview
# feature: 

## image for open graph
# og: "/post/about-learning/featured.jpg"

## when calling "resources" shortcode, well link to static folder with this path 
# resources: /common/

## customize page background
# background: [watercolor-A] 

## listout with recommand, new and all pages
# listable: [recommand, all]
---

<!-- https://home.gamer.com.tw/creationDetail.php?sn=5244818 -->

之前就一直好奇《超閾限空間 Superliminal》中神奇的透視操作是怎搞實現的，但不是放大和縮小，而是可以用透視把物體投影進背景的神奇效果。

<!--more-->

https://i.imgur.com/ndAyegA.gif

原本以為是用頂點操作的方式，Raycast 把所有頂點貼到背景上，但多想一下之後就會發現問題了，交界處怎麼裁切？ 所以這個做法就被否定了。直到前天晚上洗澡的時候，我在腦中模擬各種方法嘗試計算，等洗完的那一刻思路剛好通了，答案浮現於腦中。

## 成果展示

建立了簡單的場景，用棋盤方塊作進行展示，可以在裡面自由走動，然後把方塊拿起來，當放開的瞬間它就會被貼進背景當中。

https://i.imgur.com/Aepjhgk.gif

### 運作原理

簡單來說，透過像素的世界座標，反推原本透視視角的 UV，再把原本視角中的圖像用後處理疊上當前畫面就能到了。

https://i.imgur.com/IAdl2zP.jpg

至於針對特定物件的投影，可以透過攝影機的 Layer 過濾，我用兩個攝影機來做效果。主攝影機，負責遊戲畫面渲染，會把被投影的棋盤方塊過濾掉。

https://i.imgur.com/VWkN0Xy.jpg

投影攝影機，放下物體時會拍攝只有投影物件的快照，輸出一張棋盤方塊的 `RenderTexture`。

https://i.imgur.com/Ty9Nnuw.jpg

最後把快照傳給主攝影機，透過後處理 Shader 進行計算，繪製出被投影到背景裡的物件。

https://i.imgur.com/WOKAAw4.jpg

### 座標轉換

投影的第一步是取得像素世界座標，細節可以參考 [這篇文章](https://home.gamer.com.tw/artwork.php?sn=5212692)，這裡就只解說後面的步驟，其實就是再做一次渲染流程中的座標轉換而已。

第一步是將「世界空間」轉換成攝影機的「攝影機空間」，可以與攝影機的 Inverse Transform Matrix 相乘得出，注意這裡的攝影機是投影視角的那個，不是主攝影機。

https://i.imgur.com/CFMorKz.jpg

接著透過矩陣投影進攝影機的裁切空間，再把 z 軸深度壓掉變成二維的螢幕空間。

https://i.imgur.com/isA7qzH.png
https://i.imgur.com/uN5kiP2.png

最後只要縮放和偏移就能推算出正確的 UV 數值了，用它對快照圖片採樣，在透過後處理疊加進畫面中就完成物體投影了。

https://i.imgur.com/NBYfnqP.gif
https://i.imgur.com/HMFoAwB.jpg

用一連串帥氣的矩陣操作完成投影！我也希望我做得到...但實際開始才發現窩的圖學觀念不夠扎實，搞不出來
這也是為什麼上面的解說沒什麼數學解釋。

殘念阿，邏輯都對結果卡在 rendering pipline 的基本知識不充足，所以最後還是到處翻資料，找了一個現成的方法取得 viewProjection Matrix，直接完成所有工作。

```hlsl
_projectionMat = camera.nonJitteredProjectionMatrix * transform.worldToLocalMatrix

float4 projected = mul(_projectionMat, worldPos)
float2 projUV = (projected.xy / projected.w) * 0.5 + 0.5;
```

[參考資料](https://gamedev.stackexchange.com/questions/166757/how-can-i-transform-a-world-space-point-to-a-cameras-screen-coordinate)，直接幫我完成上面解說的所有步驟了。說實話不算太難，只要理解原理就很好實現了，最有挑戰性的還是憑空猜測原理的時候。

### 問題修正

**影子的消失**

實做還有幾個問題在，第一是影子的問題，因為投影要把原本的物件隱藏，導致原本渲染的物體陰影也消失不見。至於修正方法，我是直接弄一個只會讓 mesh 投影出陰影的透明材質，讓陰影保持渲染，簡單 :P

https://i.imgur.com/pPvwigd.jpg

**採樣超出範圍**

在後處理繪製投影結果的時候，Texture Sampler 會根據 wrapMode 對超出範圍的 UV 做出反應，延伸、重複和鏡射之類的。我直接用 `saturate()` 函式限制 uv 的數值防止重複，但投影時物體被畫面截斷還是會發生拉伸問題，但懶得修了w

https://i.imgur.com/55W1EmP.gif


**反向的投影**

如圖，因為往反方向的投影結果也是成立的，所以會在背後也繪製一次投影，修正是透過 `dot()` 函式檢查方向，確保投影方向是和視角相同的。

https://i.imgur.com/L0yUpBh.jpg

**投影遮擋**

還有一個問題，因為沒做深度檢測，所以障礙物的前後都會被畫上投影物體，有機會再修正它吧。

https://i.imgur.com/kwqmBS3.jpg

## 感謝閱讀

就醬，想通以後花了些時間實現，回復不少能量

https://i.imgur.com/0m3qvHb.gif

[原始檔在這，歡迎參考研究](https://github.com/angus945/Superliminal_perspectiveProjection)

WSAD 移動，左鍵長按拖動物件，按 R 旋轉物件，滾輪移動距離，放開就把物體投影到背景上了，投影之後只有視角正確才能把它拿回來，可以長按 E 回到正確的位置。請不要介意那個超級糟糕的控制手感，我沒有花很多時間在 playerControler 上 www

### 參考資料

[【Unity Image Shader 學習筆記】表面掃描效果、用GL自定義Blit、取得深度與shader取得世界座標](https://home.gamer.com.tw/artwork.php?sn=5212692)

[How can I transform a world space point to a camera's screen coordinate?](https://gamedev.stackexchange.com/questions/166757/how-can-i-transform-a-world-space-point-to-a-cameras-screen-coordinate) 