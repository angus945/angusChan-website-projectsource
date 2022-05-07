---
title: "SurfaceShader Inputstruct"
date: 2020-06-25
draft: false
tags: []

## customize page background
# background: static/shader/sandboxShader.glsl

## listout with recommand, new and all pages
# listable: [recommand, new, all]
---

<!--more-->

Surface Shader 筆記
2. Shader  Input

你需要在shader function中處理Mesh 的任何值，Shader對外界接收的各種訊息
    struct Input
    {
               
    };
(struct Input {  } 記得括弧後要加分號 ; )

基本參數
命名需要正確才能運作

uv, uv2
這個數據可用於在模型上放置Texture
需要配合屬性的名稱 ，uv 或 uv2 + 屬性名稱
_MainTex ("Example Texture", 2D) = "white" { }
    struct Input
    {
        float2 uv_MainTex;
        float2 uv2_MainTex;
    };

ViewDir
取得由點指向視線位置的向量，用於根據攝影機位置改變模型的Shader
    struct Input
    {
        float3 viewDir;
    };

worldPos
提供正在處理的頂點座標，允許你根據世界座標對Shader進行操作
    struct Input
    {
        float3 worldPos;
    };

worldRefl
物理世界反射? 取得反射訊息，用於鏡面效果
    struct Input
    {
        float3 worldRefl;
    };

所有輸入 Unity API
https://docs.unity3d.com/Manual/SL-SurfaceShaders.html

在Input struct中組合各種屬性，以實現複雜的Shader效果
只需使用必要的輸入，以免佔用多餘的記憶體
    struct Input
    {
        float2 uv_MainTex;
        float viewDir;
        float3 worldRefl;             
    };
