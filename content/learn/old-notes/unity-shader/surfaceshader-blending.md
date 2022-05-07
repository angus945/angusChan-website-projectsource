---
title: "Surfaceshader Blending"
date: 2020-07-18
draft: false
tags: []

## customize page background
# background: static/shader/sandboxShader.glsl

## listout with recommand, new and all pages
# listable: [recommand, new, all]
---

<!--more-->

Surface Shader 筆記
4.Rendering - Blending FrameBuffer

使用 Frame Buffer 中暫存的顏色，融合場景物件的顏色，做出混合顏色的效果
[參照筆記 3.Buffer and Queue]

注意: Blend的運算非常抽象...建議來回重複看加實作

此篇筆記都不是使用 CG語法
 
關鍵字 Blend
使用關鍵字 Blend 將兩種顏色進行乘法運算後加在一起
Blend Func(Input = SrcFactor) + Func(Input = DestFactor)
Blend 乘法算式(算式輸入值 = 傳入的顏色) + 乘法算式(算式輸入值 = 當前的顏色)  
傳入的顏色: 正在處理的 Texture顏色
當前的顏色: Frame Buffer暫存中的顏色

注意: 顏色的運算為計算機(電腦) RGB值的運算
所以白色(255) + 黑色(0)的結果還是白色(255 + 0)
而不是灰色，會違反現實中顏料或光線相加的直覺
再註: 實際計算是 白色(1) 黑色(0)，因為數字大比較有感覺所以上面用 0~255解釋

算式解說
Blend 乘法算式 乘法算式
One  將算式輸入值乘上 1，即顏色保持不變
Zero 將算式輸入值乘上 0，即變為黑色
SrcColor 將算式輸入值乘上 傳入的顏色
SrcAlpha 將算式輸入值乘上 傳入 Alpha
DstColor 將算式輸入值乘上 當前的顏色
DstAlpha 將算式輸入值乘上 當前 Alpha
OneMinusSrcColor 將算式輸入值乘上 (1 - 傳入的顏色)
OneMinusSrcAlpha 將算式輸入值乘上 (1 - 傳入 Alpha)
OneMinusDstColor 將算式輸入值乘上 (1 - 當前的顏色)
OneMinusDstAlpha 將算式輸入值乘上 (1 - 當前 Alpha)
註: 實際計算是白色(1) 黑色(0)，所以使用 (1 - 顏色)會讓顏色變"相反"

文檔: https://docs.unity3d.com/Manual/SL-Blend.html

設置混合模式
SubShader
{        
        Blend One One
        pass  { 設置Texture }
}

Blend One One
兩種顏色保持不變 (*1)，直接相加
會讓整個材質感覺像半透明的(因為原本(後面)的顏色被加上去了)，而且會很亮
也會讓 Texture黑色的部分變透明
黑色變透明是因為: Blend = (0 * 1 + DestFactor * 1) = (0 + DestFactor) = DestFactor

Blend SrcAlpha OneMinusSrcAlpha
傳入的顏色 * 傳入的 Alpha + 當前的顏色 * (1 - 傳入的 Alpha)
就和傳統的 Transparent材質一樣，越不透明蓋掉得越多

Blend DstColor Zero
傳入的顏色 * 當前的顏色 + 當前的顏色 * 0
等於直接就是傳入的顏色和當前的顏色相乘

註: 透明度若要正確顯示，必須修改 Render Queue，或 Render Queue Tag  
[參照筆記 Buffer and Queue]

使用 Pass區塊設置 texture
_MainTex ("Texture",2D) = "black" { }
pass
{
    SetTexture [_MainTex] { combine texture }
}
