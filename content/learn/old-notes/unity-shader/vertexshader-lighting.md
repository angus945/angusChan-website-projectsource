---
title: "Vertexshader Lighting"
date: 2020-07-25
draft: false
tags: []

## customize page background
# background: static/shader/sandboxShader.glsl

## listout with recommand, new and all pages
# listable: [recommand, new, all]
---

<!--more-->

Vertex Lighting
Vertex shader中並不包含預設的光照模型，所以需要自行計算

此編筆記中只有重點程式碼

設置光照模式
Tags { "LightMode" = "ForwardBase" }

引用文件
#include "UnityCG.cginc"
#include "UnityLightingCommon.cginc"

struct appdata
{
    法線輸入，照明計算中最重要的部分
    > float3 normal : NORMAL;
};

struct v2f
{
    保存計算中照明產生的顏色 diffuse
    > fixed4 diff: COLOR0;
};

計算照明
v2f vert (appdata v)
{
    計算光照
    算式講解參照筆記 [Surface Shader 4.Lighting - Writing Lighting Model]

    使用 UnityObjectToWorldNormal將頂點法線轉換成 worldSpace
    > half3 worldNormal = UnityObjectToWorldNormal(v.normal);

    使用 _WorldSpaceLightPos0取得光源方向
    > half nl = max(0,dot(worldNormal, _WorldSpaceLightPos0.xyz));

    光源強度 * 光照顏色
    > o.diff = nl * _LightColor0;

    return o;
}

fixed4 frag (v2f i) : SV_Target
{
    fixed4 col = tex2D(_MainTex, i.uv);

    將光照計算後的顏色加入 texture顏色
    > col *= i.diff;
    return col;
}

