---
title: "Shaderlab Variable"
date: 2020-06-17
draft: false
tags: []

## customize page background
# background: static/shader/sandboxShader.glsl

## listout with recommand, new and all pages
# listable: [recommand, new, all]
---

<!--more-->

Shaderlab  筆記
1. Shaderlab variable

=== Basis Data Types ===
float
32 byts的浮點數變量，最高精度的浮點數
適合用於世界座標 worldPosition 和紋理座標

half
16 byts的浮點數
適合用於短向量 vectors, 方向 dirctions和動態顏色範圍 dynamnic colour range

fixed
11 byts的浮點數，最小的浮點數變量
適合用於顏色

int
和C# 的int 一樣

=== Packed Arrays ===
在變量後方加2到4的數字，對應陣列長度，各維度的軸向
int2, flaot3, fixed4

建立
fixed4 colour1;
fixed4 colour2 ;
長度為四的陣列，調用時分別對應 (r,g,b,a) 或 (x,y,z,w)

使用時可以指定 colour1.r = 0 或 colour1.x = 0

不同長度的壓縮陣列不能直接混用
fixed3 colour3;
colour3 = colour1 (錯誤，不能把 fixed3指定進 fixed4 )
但可以指定通道
colour3 = colour1.rgb;

可以重新排序 (swizzling)
fixed3 colour3;
colour3 = colour1.bgr

填充 (smearing)
fixed3 colour3 = 1;
的結果和
fixed3 colour3 = (1,1,1)
是一樣的

複製 (masking)
能夠直接指定通道值
colour1.rg = colour2.gr

=== Packed Matrices ===
在變量後方加上 行數 x 列數 (注意是英文字母 x 不是符號 *
float4x4 matrix;

矩陣的index由左上方從 0 開始
int3x3 matrix;
       column
row [0,0] [0,1] [0,2]
       [1,0] [1,1] [1,2]
       [2,0] [2,1] [2,2]

矩陣中的值使用 _m 行數 列數調用
float myValue = matrix._m00;

鍊式調用? Chaining
fixed4 colour = martix._m00_m01_m02_m03;
允許直接指定多個矩陣元素放入壓縮陣列中

fixed4 colour = matrix[0]
也能直接指定整行矩陣元素

=== Texture Data Type ===
sampler2D
常規的texture

samplerCUBE
用於立方體貼圖 (如: Skybox

各自都有高精度和低精度的版本
sampler2D_half;
sampler2D_float;

samplerCUBE_half;
samplerCUBE_float;

