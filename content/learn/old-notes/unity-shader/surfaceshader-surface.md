---
title: "Surfaceshader Surface"
date: 2020-07-03
draft: false
tags: []

## customize page background
# background: static/shader/sandboxShader.glsl

## listout with recommand, new and all pages
# listable: [recommand, new, all]
---

<!--more-->

Surface Shader 筆記  
3. Surface

surface shader
表面著色器，大概就是一般材質球的概念 ?

surface 函式
#pragma surface 函數命名 光照模型 (模型採用基本模型 [ 參照筆記 4. Lighting Model])
> #pragma surface surf Lambert

void 函數名稱 (輸入, 輸出)
輸入: Input IN 接收外界的資訊 [ 參照筆記 2. Input struct ]
輸出: inout SurfaceOutput o 計算完畢的顏色輸出 [ 參照筆記 2. Channel ]
註: inout大概像 C#的 ref關鍵字?
輸出會受到光照模型影響，不同光照模型會允許使用額外的輸出值

範例
> 將表面顏色改為 Texture (_MainTex)
sampler2D _MainTex;
void surf (Input IN, inout SurfaceOutput o)
{                
    fixed4 c = tex2D(_MainTex, IN.uv_MainTex);

    o.Albedo = c.rgb;
}
註: 可以將 IN.uv_MainTex * 縮放，來改變貼圖大小
註: 可以將 IN.uv_MainTex * 時間 * 偏移方向，來做出動態材質

> 將表面顏色改為含有不透明度的 Texture (_MainTex)
#pragma surface surf Lambert alpha:fade
sampler2D _MainTex;
void surf (Input IN, inout SurfaceOutput o)
{                
    fixed4 c = tex2D(_MainTex, IN.uv_MainTex);

    o.Albedo = c.rgb;
    o.Alpha = c.a;
}
註: 渲染列隊須改為 alphaTest或 Transparent，才能正確渲染 [參照筆記 3. Buffer and Queue]

>  使用 Normal map [ 參照筆記 2. Channel ]
sampler2D _MainTex;
sampler2D _BumpTex;
void surf (Input IN, inout SurfaceOutput o)
{
    o.Albedo = tex2D(_myDiffuse, IN.uv_myDiffuse).rgb;  
    o.Normal = UnpackNormal(tex2D(_myBump, IN.uv_myBump));
}
註: 可以將 Normal值乘上強度，來增強、減弱陰影效果

這篇是基本的表面著色器實作筆記，其實光這幾行在加一些判斷式
就能混合出不少蠻酷的效果了，之後還會有進階混合顏色的筆記
但我又要開始忙主專案了 XD

我的筆記是打在記事本上的，所以字的顏色都是到這裡才上
配色有什麼建議也歡迎提，我盡量會統一格式啦

接下來就是光照模型的部分了 Lighting Model