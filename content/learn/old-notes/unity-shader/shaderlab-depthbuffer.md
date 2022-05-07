---
title: "Shaderlab Depthbuffer"
date: 2020-09-12
draft: false
tags: []

## customize page background
# background: static/shader/sandboxShader.glsl

## listout with recommand, new and all pages
# listable: [recommand, new, all]
---

<!--more-->

Shaderlab 筆記
5. Camera Depth Texture

參照筆記 [Surface Shader - 3. Buffer and Queue]
使用Depth Buffer暫存的深度資訊，做出各種效果

如
水深: 水下地面的像素深度 - 水面像素深度 = 水深
交界判斷: 相交物體像素深度 - 表面深度 = 相交深度 (相交深度淺的部分就是交界處)

此篇筆記只有重點程式

    sampler2D _CameraDepthTexture;
    全域變量_CameraDepthTexture，可以取得當前Depth Buffer 的像素深度資料，以Texture 的
    形式儲存

    v2f vert (appdata v)
    {
        v2f o;
        o.vertex = UnityObjectToClipPos(v.vertex);

        o.screenPosition = ComputeScreenPos(o.vertex);
        把在Clip Sapce 的頂點座標，轉換成螢幕空間的座標，包括深度

        return o;
    }

    fixed4 frag (v2f i) : SV_Target
    {

        fixed4 depth = tex2Dproj
        (_CameraDepthTexture, UNITY_PROJ_COORD(i.screenPosition)).r;
        把i.screenPosition 傳換成texture UV，取出正在處理位置的暫存深度
        註: 使用tex2Dproj 是為了把i.screenPosition 的正交投影轉會為透視投影

        float depthLinear = LinearEyeDepth(depth);
        將取出的傳存深度轉換為線性
        註: 可能和人眼有關?，_CameraDepthTexture 的深度值是非線性的
        修正，和人眼無關，非線性是為了在近距離有更高的精度

        float sphereDepth = saturate(depthLinear - i.screenPosition.w);
        將暫存深度 - 當前深度，計算出相交深度

        最後再使用相交深度，做出自己需要的效果

        return sphereDepth;
    }

這部分其實理解之後就蠻簡單的了

感謝放肆大大

https://youtu.be/IzJuqhWmN3k