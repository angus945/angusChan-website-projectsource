---
title: "SurfaceShader Properties"
date: 2020-06-22
draft: false
tags: []

## customize page background
# background: static/shader/sandboxShader.glsl

## listout with recommand, new and all pages
# listable: [recommand, new, all]
---

<!--more-->

Surface Shader 筆記
2. Shader Properties

建立屬性
Shader從 Inspector獲取屬性的方法，在Properties中建立
Properties
{
    變量名 ( "顯示名", 輸入類型 ) = 初始化
}

建立一個有color picker的屬性，初始值白色
_myColor ("Example Color", Color) = (1,1,1,1)

有Slider的數值屬性，初始值 1
_myRange ("Example Range", Range(0,5)) = 1

Texture屬性，顯示圖像的Texture框，初始值為空白，在未分配 Texture時使用顏色 "white"
_myTex ("Example Texture", 2D) = "white" { }
註: 未分配 Texture時的顏色，也會輸入到材質的非 Albedo通道，如透明材質的 Alpha (0~1)

Cube屬性，像是Skybox，初始值空白
_myCube ("Example Cube" , Cube) = "" { }

一般的float數值屬性，初始值 0.5
_myFloat ("Example Float", Float) = 0.5

向量屬性，初始值 (0.5, 1, 1, 1)
_myVector ("Example Vector", Vector ) = (0.5,1,1,1)

注意句尾不需要 ;
float尾不須 f


定義屬性
建立屬性後必須經過定義變量才能使用
SubShader
{
    CGPROGRAM

        fixed4 _myColor;
        half _myRange;
        sampler2D _myTex;
        samplerCUBE _myCube;
        float _myFloat;
        float4 _myVector;

   ENDCG
}


特殊屬性

高光的顏色
_SpecColor ("Colour",Color) = (1,1,1,1)
_SpecColor 已經在 Unity建構文件 'include'中被定義了，不需再多定義一次，會出error