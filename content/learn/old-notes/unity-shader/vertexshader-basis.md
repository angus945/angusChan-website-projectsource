---
title: "Vertexshader Basis"
date: 2020-07-19
draft: false
tags: []

## customize page background
# background: static/shader/sandboxShader.glsl

## listout with recommand, new and all pages
# listable: [recommand, new, all]
---

<!--more-->

Vertex Shader筆記
2.basis struct (對從2開始

頂點著色器基本結構

Shader "Unlit/NewUnlitShader"
{
    屬性 [參照 Shaderlab筆記 2.Properties]
    Properties
    {
        _MainTex ("Texture", 2D) = "white" {}
    }
    SubShader
    {
        Tags { "RenderType"="Opaque" }
        LOD 100

        vertex shader 所需的編譯指令都將被包含在 Pass { } 的範圍中
        Pass
        {
            宣告為CG語法
            CGPROGRAM

            vertex 頂點著色器允許訪問模型中的每個頂點，可以對其設置顏色或操作
            #pragma vertex vert   

            fragment 片段著色器允許對像素著色，也可以訪問相對於世界位置的像素
            #pragma fragment frag

            允許使用霧化，如果不需要此效果可以移除
            #pragma multi_compile_fog

            引用 UnityCG.cginc文件，協助編寫 vertex shader
            #include "UnityCG.cginc"
            註: 類似 C#的 namespace

            vertex shader的兩個結構，用於保存 shader的數據            
            appdata 包含每個頂點的訊息，可以訪問更多或更少的所需數據
            struct appdata
            {
                變量 命名 : 關鍵字
                變量 [參照筆記 Shaderlab - 1.Variables]
                命名的名稱無關緊要，可以任意取
                關鍵字為著色器變量讓顯示卡識別的名稱，必須正確

                float4 vertex : POSITION;
                float2 uv : TEXCOORD0;
            };
            註: 所有訪問值可以在 UnityCG.cginc的 sppdata_full中找到

            v2f (vertex to frament) 包含片段函式所需的所有屬性
            用於將頂點的世界座標轉換為畫面座標
            struct v2f
            {
                float2 uv : TEXCOORD0;
                UNITY_FOG_COORDS(1)

                注意 SV_POSITION的聲明方式，因為 vertex在轉換為畫面空間後
                會具有不同的座標
                float4 vertex : SV_POSITION;
            };
            註: 編寫 Shader必須盡可能嚴格，不需要的數據就不要進行訪問
            文檔: https://docs.unity3d.com/Manual/SL-VertexProgramInputs.html

            sampler2D _MainTex;
            float4 _MainTex_ST;
            註: sampler2D _MainTex 為 frag()中使用的 _MainTex
            註: float4 _MainTex_ST 其中包含紋理的縮放數據，此變量代表 vert()中使用
            的_MainTex

            頂點著色器 vert將 appdata的 3D數據投影到 2D的裁剪空間並再將數值放入 struct v2f
            v2f vert (appdata v)
            {
                v2f o;

                將頂點作標和 UV投影到裁剪空間
                o.vertex = UnityObjectToClipPos(v.vertex);                
                o.uv = TRANSFORM_TEX(v.uv, _MainTex);

                UNITY_TRANSFER_FOG(o,o.vertex);
                return o;
            }
            註，警告: 可能是設備的問題，在宣告臨時變量時沒有初始化會導致 Shader無法進行
            運算，此情況只需要將回傳結構初始化就好
            如: v2f o = (v2f)0; float4 color = float4(0,0,0,0);

            片段著色器 frag會自動將所有 v2f的資訊"壓入"裁剪空間(Clipping Space)，把座標攤平
            為2D
            frag 可以計算最終畫面渲染時每個像素的顏色，回傳像素顏色 fixed4
            fixed4 frag (v2f i) : SV_Target
            {
                // sample the texture
                fixed4 col = tex2D(_MainTex, i.uv);
                // apply fog
                UNITY_APPLY_FOG(i.fogCoord, col);
                return col;
            }
            ENDCG

            註: 命名規則，在 vert中的臨時變量 v2f，因為是要輸出給 frag使用的回傳值
            所以命名為 o(output)，而 frag的 v2f為輸入值所以命名 i(input)

        }
    }
}

總結 Vertex Shader基本邏輯
World Space的數據會被存入 appdata
頂點著色器 vert會將 appdata的3D數據投影到2D的裁剪空間並再將數值放入 struct v2f
片段著色器 frag會自動將所有 v2f的資訊"壓入"裁剪空間(Clipping Space)，把座標攤平為2D
frag 可以計算最終畫面渲染時每個像素的顏色，回傳像素顏色 fixed4