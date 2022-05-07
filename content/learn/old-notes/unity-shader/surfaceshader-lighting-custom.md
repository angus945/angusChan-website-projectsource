---
title: "Surfaceshader Lighting Custom Model"
date: 2020-07-17 
draft: false
tags: []

## customize page background
# background: static/shader/sandboxShader.glsl

## listout with recommand, new and all pages
# listable: [recommand, new, all]
---

<!--more-->

Surface Shader 筆記
4. Lighting - Writing Lighting Model

參照筆記 [Surface Shader - 4.Lighting - Lighting Model]

自訂 Lighting Model
定義自己的 Lighting Model，設計好一套表面對於光照的反應
後面在 surface計算時會自動套上 LightModel中的光照計算

此篇為實作筆記

更改 Lighting Model為自訂模型
#pragma surface surf 自訂模型命名
> #pragma surface surf OwnModel

Lighting Function

>  Lambert 模型的計算式，如果要不同的光照效果就會在這裡更改算法
half4 Lighting + 模型名 (SurfaceOutput s, 光線方向(half3), 光衰減值(half))

使用表面法線和光源方向進行點積運算，計算出光照強度(夾角大小)，再乘上光照顏色後回傳
half4 LightingOwnModel (SurfaceOutput s, half3 lightDir, half atten)
{
    half NdotL = dot(s.Normal ,lightDir);
    half4 c;
    c.rgb = s.Albedo * _LightColor0.rgb * (NdotL * atten);
    c.a = s.Alpha;
    return c;
}
註: _LightColor0 定義在 UnityShader文件中，可以取得燈光的顏色


> Blinn - Phong 模型的計算式
half4 Lighting + 模型名 (SurfaceOutput s, 光線方向(half3), 視線方向(half3), 光衰減值(half))

使用視線方向+光源方向 normalize計算出的中途向量，和法線進行點積運算，計算出高光強度
half4 LightingOwnModel (SurfaceOutput s, half3 lightDir, half3 viewDir, half atten)
{
    half3 h = normalize(lightDir + viewDir);
                
    half diff = max (0,dot(s.Normal, lightDir));

    float nh = max (0, dot(s.Normal , h));
    float spec = pow (nh,48.0);

    half4 c;
    c.rgb = (s.Albedo * _LightColor0.rgb * diff + _LightColor0.rgb * spec) * atten;
    c.a = s.Alpha;
    return c;
}


> 卡通的陰影效果，需要一張由左至右深到淺，沒有漸變的 Texture

和 Lambert算法一樣，但使用點積運算出的值來分配 texture uv
Texture (sampler2D _RampTex)
half4 LightingOwnModel (SurfaceOutput s,half3 lightDir,half atten)
{
    half diff = dot(s.Normal,lightDir);
    float h = diff * 0.4 + 0.5;
    float2 rh = h;
    float3 ramp = tex2D (_RampTex, rh).rgb;

    float4 c;
    c.rgb = s.Albedo * _LightColor0.rgb  * ramp;
    c.a = s.Alpha;
    return c;
}

