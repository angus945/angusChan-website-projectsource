---
title: "Compute Shader"
date: 2022-05-14T17:12:03+08:00
lastmod: 2022-05-14T17:12:03+08:00

draft: false

description:
tags: []

## image for preview
# feature: 

## image for open graph
# og: "/post/about-learning/featured.jpg"

## when calling "resources" shortcode, well link to static folder with this path 
# resources: /common/

## customize page background
# background: static/shader/sandboxShader.glsl

## listout with recommand, new and all pages
# listable: [recommand, new, all]
---

<!--more-->

CPU 語言與 
GPU 語言

以下以 C# 代表 CPU 語言

以 HLSL 代表 GPU 語言

以 Unity 中的 Compute Shader 為主

---

## 概括

大致有兩項重點

並行概念與資料傳遞

### 差異

GPU

與 CPU 的線性執行不同

以簡單迴圈為例的例子

假設要執行某項函式 10 次，在 C# 透過迴圈執行的話 index i 會從 1 到 10 依序線性執行，

```cs
for(int i = 0; i < 10; i ++)
{
    SomeFunction();
}
```

GPU 則會為同時「並行」執行

並無順序之分 (亂序)

```hlsl
[numthreads(10, 1, 1)]
void SomeFunction (uint3 id : SV_DispatchThreadID)
{
    //DoSomething
}
```

對比圖 (展示運作方法的差異，和運行速度無關)

### 資料傳遞

## 結構

```hlsl
// Each #kernel tells which function to compile; you can have many kernels
#pragma kernel CSMain

// Create a RenderTexture with enableRandomWrite flag and set it
// with cs.SetTexture
RWTexture2D<float4> Result;

[numthreads(8,8,1)]
void CSMain (uint3 id : SV_DispatchThreadID)
{
    // TODO: insert actual code here!

    Result[id.xy] = float4(id.x & id.y, (id.x & 15)/15.0, (id.y & 15)/15.0, 0.0);
}

```

### Kernel

計算核心

透過 `#pragma kernel` 關鍵字定義計算核心

```hlsl
#pragma kernel CSMain
```

實作 Kernel

以下是原始的計算核心

```hlsl
void CSMain (uint3 id : SV_DispatchThreadID)
{
    // TODO: insert actual code here!

    Result[id.xy] = float4(id.x & id.y, (id.x & 15)/15.0, (id.y & 15)/15.0, 0.0);
}
```

可以有多種計算核心

Compute Shader 不會自行運作，需要由 C# 端呼叫

### thread, thread group

對陣列元素進行並行修改

接下來說到在計算核心前面的 numthreads 欄位

```
[numthreads(10, 1, 1)]
void CSMain (uint3 id : SV_DispatchThreadID)
{
    // TODO: insert actual code here!

    Result[id.xy] = float4(id.x & id.y, (id.x & 15)/15.0, (id.y & 15)/15.0, 0.0);
}
```

定義 thread 的數量，

在 C# 的情況中類似這樣 

```cs
for(int x = 0; x < numthreads.x; x ++)
{
    for(int y = 0; y < numthreads.y; y ++)
    {
        for(int z = 0; z < numthreads.y; z ++)
        {
            CSMain(new uint3(x, y, z));
        }
    }
}
CSMain(uint3 id)
{

}
```

這個比喻並不精確 幫助理解

## 資料傳遞

GPU 運算 使用的是 GPU 緩衝

而非 CPU 的記憶體或快取

因此任何資料操作錢都需要先傳遞至 GPU

### Buffer

StructuredBuffer

AppendStructuredBuffer

### Texture


`RWTexture2D <float4> Result;`

Texture2D

## 實作 範例

傳遞資料並拿回

傳遞資料並直接進渲染管線

GPU Instance, Culling

Animation Instance


