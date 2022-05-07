---
title: "Surfaceshader Bufferandqueue"
date: 2020-07-02
draft: false
tags: []

## customize page background
# background: static/shader/sandboxShader.glsl

## listout with recommand, new and all pages
# listable: [recommand, new, all]
---

<!--more-->


==== Buffer ====

Frame Buffer
機算機的內存結構，用於保存螢幕上出現的每個像素的顏色訊息
 
Depth Buffer (Z Buffer)
大小和 Frame Buffer一樣，但儲存的是每個像素的深度訊息 (離畫面的遠近)
在像素添加至 Frame Buffer之前會先經過檢查，此像素是否在 Depth Buffer有值
如果有就代表繪製的像素重疊，於是必需將 Frame Buffer的像素替換成深度較淺的那個像素 (離畫面近)，並更新 Depth Buffer

在 SubShader中可以使用 ZWrite Off關閉 Depth Buffer的訊息寫入
或在 SubShader pass struct中使用 ZWrite On, ColorMask啟用半透明 Depth Buffer寫入
註: ZWrite, ColorMask 都為非 CG語法

G - Buffer
幾何緩衝區，會在"延遲渲染" 中使用

Stencil Buffer
模板緩衝區，用於進一步控制從場景到 Frame Buffer的像素，可以做出遮罩類的效果
類似Depth Buffer，但可以將所有類型放置緩衝區中，不只有深度

在 SubShader Stencil { } 中
使用 Ref + 數字，在 Stencil Buffer寫入數值，如: 1, 2, -1
使用 Comp + 條件，對 Stencil Buffer中的內容進行判斷，如: 總是 (always), 不等於 (notequal)
使用 Pass + 行為，在判斷後做出行為，如: 替換(replace), Keep(保持)
可以使用屬性，如: Ref [屬性], Comp [屬性], Pass [屬性]
文檔: https://docs.unity3d.com/Manual/SL-Stencil.html
註: 非CG語法

==== Rendering ====
Unity的實體幾何 (Geomentry) 是從前到後渲染的 (先畫近在畫遠)
如果 Depth Buffer已經有值，就會直接忽略新的像素訊息
這樣做可以避免重覆將像素寫入 Frame Buffer

正向渲染 Forward Rendering
可以渲染半透明物件

渲染單個對象
Geometry => VertexShader => Geometry Shader => Fragment Shader Lighting =>
[Frame Buffer]

渲染多個對象，每個對象都需要計算環境中所有光線
Geometry => VertexShader => Geometry Shader => Fragment Shader Lighting
Geometry => VertexShader => Geometry Shader => Fragment Shader Lighting
Geometry => VertexShader => Geometry Shader => Fragment Shader Lighting
All => [Frame Buffer]

延遲渲染 Deferred Rendering
適合用在光源很多的時候

渲染單個對象
Geometry => VertexShader => Geometry Shader => Fragment Shader =>
[G-Buffer] => Lighting => [Frame Buffer]

渲染多個對象，照明計算只會進行一次
Geometry => VertexShader => Geometry Shader => Fragment Shader  
Geometry => VertexShader => Geometry Shader => Fragment Shader
Geometry => VertexShader => Geometry Shader => Fragment Shader  
All => [G-Buffer] => Lighting => [Frame Buffer]

預設情況，Unity使用的是 Forward Rendering
可以在 Edit > Project Settings > Graphics > Rendering Path 設定選染管道

==== Render Queues ====
通過使用選染列隊控制目標的繪製順序

預設列隊
Background => Geomentry => AlphaTest => Transparent => Overlay
註: 半透明渲染需要先有與物件後方不透明物件重疊的像素顏色，才能夠進行顏色混合，所以順序得在 Geomentry之後

指定 Render Queue Tag
Tags { "Queue" = "Geometry" }
Tags { "Queue" = Transparent" }
也可以再加上自定數值
Tags { "Queue" = "Geometry + 100" }
註: 非 CG語法

在 Inspector裡 Renderer Queue可以直接輸入想要的值，不被預設列隊限制
