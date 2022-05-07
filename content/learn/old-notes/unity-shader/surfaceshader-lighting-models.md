---
title: "Surfaceshader Lighting Models"
date: 2020-07-06
draft: false
tags: []

## customize page background
# background: static/shader/sandboxShader.glsl

## listout with recommand, new and all pages
# listable: [recommand, new, all]
---

<!--more-->

Surface Shader 筆記  
4.Lighting - Lighting Model

=== Lighting Model ===

Lambert
缺乏複雜性，簡單的照明模型，計算快速
在計算中僅使用表面 Normal和朝向光源的向量，並不能生成反射和高光

Phong
考量視角位置及光源線如何從表面反射的模型，包括鏡面反射，和光如何從表面彈起
透過光線的反射，計算視角的高光

Blinn - Phong
將 Phong 模型加入一個 halfway(中途向量)，為點朝光源 + 點朝視線位置的單位向量
減少了計算反射向量 (cos運算)的需要，直接透過中途向量和頂點 Normal的點積運算，計算出高光強度

Standard (PBR)
著重於光對表面的影響

StandardSpecular (PBR)
著重光被照明對象的反射
 
=== Physically-Based Rendering ===

反射 Reflection
將光線從視角位置引到反射面，然後計算反射位置
這是和照明相反的計算

漫反射 Diffusion
通過判斷吸收什麼光、反射出什麼光
來檢查顏色和光如何分布在整個表面

透明和半透明 Translucenty and Transparenty
檢查光線如何穿過物體，使它們透明或半透明
 
能量守恆 Conservation of Energy
確保物體反射的光不會超過吸收的光 (除非是完美的鏡片效果?)
有些光將被反射並可以照亮其他物體

金屬性 Metallicity
考慮光在發光表面上的相互作用，及高光的反射

非涅耳反射率 Fresnel Reflectivity
檢查曲面上的反射如何向邊緣增強
現實中反射在曲面上的作用方式，邊緣的反射更強烈，並向中心漸弱
這種效果將隨不同表面類型而變化，但絕對不會在曲面上獲得像水平線的完美直線

微表面散射 Microsurface Scattering
表示大多數的表面都將包含不規則凹槽或裂縫
反射光的角度將不同於規則表面所指定的角度
註: 就是 normal map的計算啦

=== Vertex Versus Pixel Lighting ===

頂點照明和像素照明

頂點照明 Vertex Lighting
在每個頂點處計算入射光，並在整個表片上平均
適合舊型顯卡或手機類移動型設備，或品質要求不高的大量炫染

像素照明 Pixel Lighting
計算每個像素的光照
擁有比 Vertex Lit更細緻的鏡面高光，和更詳細的陰影