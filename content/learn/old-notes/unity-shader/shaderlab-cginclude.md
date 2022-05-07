---
title: "Shaderlab Cginclude"
date: 2020-12-05
draft: false
tags: []

## customize page background
# background: static/shader/sandboxShader.glsl

## listout with recommand, new and all pages
# listable: [recommand, new, all]
---

<!--more-->

Shaderlab
自訂和引用函式文件

建立函式庫腳本 cginc
建立一個文字文件 myCgIncloud.txt，並將副檔名改成 .cginc

.cginc
{
    定義文件，使用if判斷定義狀態，注意是 ifndef 不是 ifdef
    #ifndef myCgIncloud
    #define myCgIncloud
    
    編寫函式
    fixed4 cgFunction(fixed4 c)
    {
        return  1 - c;
    }

    結束判斷
    #endif
}


引用文件函式
.shader
{

    CGPROGRAM
    如果引用文件和Shader腳本在同一個資料夾[分支]上，就只需要 "myCgIncloud.cginc"，如果
    在不同分支的話，則是從分支開始 "path.../myCgIncloud.cginc" (需要斜線 / )
    #include "myCgIncloud.cginc"

    fixed4 frag (v2f i) : SV_Target
    {
        fixed4 col = tex2D(_MainTex, i.uv);

        調用函式
        return cgFunction(col);
    }
}

註 : Unity 2020 版本似乎更改引用文件的路徑寫法了，若在不同資料夾中便從 Assets 開始寫下完整路徑 (這樣好多了==)

參考資料
https://blog.csdn.net/candycat1992/article/details/38920347