---
title: "SurfaceShader Channel"
date: 2020-07-01
draft: false
tags: []

## customize page background
# background: static/shader/sandboxShader.glsl

## listout with recommand, new and all pages
# listable: [recommand, new, all]
---

<!--more-->

Surface Shader 筆記
2. Channel

= Surface ======

Albedo
反照(反射?)率，繪製該位置時的顏色
受光線照射時，吸收什麼顏色，反射出什麼顏色的光

Emission
自發光，繪製該位置時的 HDR顏色

Normal
法線，繪製該位置時，對於光照角度所呈現出的的虛擬陰影
normal map需要用 UnpackNormal(tex2D( , ))轉換
> o.Normal = UnpackNormal(tex2D(_mainBump, IN.uv_mainBump));

Alpha
不透明度，繪製該位置時的不透明度
需要在 #pragma 添加 alpha:fade
> #pragma surface surf Lambert alpha:fade
需要更改渲染列隊 alphaTest, Transparent [參照筆記 3.Buffer and Queue]

= Texture ======

Diffuse map
漫反射貼圖，用於 Albedo通道
只提供顏色來放置至 Mesh上

Alpha map
不透明度貼圖，用於 Alpha通道
提供對應 Diffuse map每像素的不透平度值
Texture 顏色由黑 (0) 到白 (255)，對應不透明度  0 ~ 1

Normal map
Normal貼圖，用於 Normal通道
提供對應 Diffuse map每像素 Normal方向，顏色的 rgb分別對應了表面方向 loacl軸的 xyz
Red: 0 ~ 255 => x: -1 ~ 1
Green: 0 ~ 255 => y: -1 ~ 1
Blue: 128 ~ 255 => z: 0 ~ 1
因為 normal map z軸方向不可能朝向表面(朝內)，所以 b(藍色)值的最小值為 128 (z: 0)
這就是為什麼 Normal map會紫紫的
運算時會根據光源和 Pixel的 Normal來做出陰影
註: Unity使用 normal map要先在 Inspector設定 Texture Type