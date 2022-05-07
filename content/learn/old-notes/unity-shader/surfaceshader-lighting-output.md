---
title: "Surfaceshader Lighting Output"
date: 2020-07-07
draft: false
tags: []

## customize page background
# background: static/shader/sandboxShader.glsl

## listout with recommand, new and all pages
# listable: [recommand, new, all]
---

<!--more-->

Surface Shader 筆記
4. Lighting - Lighting Model and SurfaceOutput

光照模型和 Surface Output
使用不同的光照模型，會允許 SurfaceOutput使用額外的輸出值

Light Model
[參照筆記 4. Lighting - Lighting Model]


模型 Lambert
> #pragma surface surf Lambert

void surf (Input IN,inout SurfaceOutput o)
{
    o.Albedo = _Colour.rgb;
}


模型 Blinn - Phong
允許鏡面反射值 (Specular)和光澤度 (Gloss)
> #pragma surface surf BlinnPhong
_SpecColor ("Colour",Color) = (1,1,1,1)
_Spec ("Specular", Range(0,1)) = 0.5
_Gloss ("Gloss", Range(0,1)) = 0.5

void surf (Input IN,inout SurfaceOutput o)
{
    o.Albedo = _Colour.rgb;
    o.Specular =  _Spec;
    o.Gloss = _Gloss;
}
註: 屬性 _SpecColor，被定義在 Unity文件中，為 BlinnPhong的高光顏色，不能再次定義也不需要再指定給 SurfaceOutupt，宣告屬性即有效果


模型 Standard (PBR)
允許使用金屬值 (Metallic)和平滑度 (Smoothness)
> #pragma surface surf Standard
_Metallic ("Metallic" , Range(0,1)) = 0.0

void surf (Input IN, inout SurfaceOutputStandard o)
{
    o.Albedo = _Color.rgb;
    o.Smoothness = tex2D (_MetallicTex,IN.uv_MetallicTex).r;
    o.Metallic = _Metallic;                     
}


模型 StandardSpecular (PBR)
允許鏡面反射值 (Specular)和平滑度 (Smoothness)
> #pragma surface surf StandardSpecular

_MetallicTex ("Metallic (R)", 2D) = "white" { }
_SpecColor ("Specular" , Color) = (1,1,1,1)
void surf (Input IN, inout SurfaceOutputStandardSpecular o)
{
    o.Albedo = _Color.rgb;
    o.Smoothness = tex2D (_MetallicTex,IN.uv_MetallicTex).r;
    o.Specular = _SpecColor.rgb;                     
}

註: Unity 有預設的兩種使用物理渲染照明 (PBR)的材質球 Standard 和 Standard (Specular setup)
