---
title: "筆記 計算著色器"
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
listable: [recommand, new, all]
---

計算著色器學習筆記

<!--more-->

以下以 C# 代表 CPU 語言

以 HLSL 代表 GPU 語言

以 Unity 中的 Compute Shader 為主

---

## 概括

大致有兩項重點

並行概念與資料傳遞

前者只要有寫過材質 Shader ，或 CPU 並行函式的話就好

後者

### 差異

GPU

與 CPU 的線性執行不同

以簡單迴圈為例的例子

同樣是重複執行函式，就以 C# 中的迴圈做對比。假設要執行某項函式 10 次，以 C# 迴圈中的迴圈寫法

i 會從 1 到 10 依序「線性」執行，

```cs
for(int i = 0; i < 10; i ++)
{
    SomeFunction(i);
}
SomeFunction(int index) 
{ 
    //DoSomething
}
```

GPU 則會為同時「並行」執行

並無順序之分（亂序）

```hlsl
[numthreads(10, 1, 1)]
void SomeFunction (uint3 id : SV_DispatchThreadID)
{
    //DoSomething
}
```

對比圖 (展示運作方法的差異，和運行速度無關)

並行有其限制

剛開始比較會遇到不知道如何編寫 

### 資料傳遞

實做上比較容易遇到問題的部份

與 C# 端的主要交界處

傳遞、接收

資料傳遞的限制也是 優化

## 結構

新建立的 Compute Shader 腳本內容如下

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

逐個解析

### Kernel

計算核心

透過 `#pragma kernel ___` 關鍵字定義計算核心

就和 vert 和 frag 函式的定義一樣，核心的名稱可以自由定義，但一定要有一個對應的函式實做才能運行

```hlsl
#pragma kernel MyComputeKernel

void MyComputeKernel (uint3 id : SV_DispatchThreadID)
{

}
```

一個計算著色器可以有，可以有多種計算核心 （共享資料？切換功能？

```hlsl
#pragma kernel MyComputeKernelA
#pragma kernel MyComputeKernelB
#pragma kernel MyComputeKernelC

void MyComputeKernelA (uint3 id : SV_DispatchThreadID) { }
void MyComputeKernelB (uint3 id : SV_DispatchThreadID) { }
void MyComputeKernelC (uint3 id : SV_DispatchThreadID) { }
```

Compute Shader 不會自行運作，需要由 C# 端呼叫 [ComputeShader.Dispatch](https://docs.unity3d.com/ScriptReference/ComputeShader.Dispatch.html)

```cs
public void Dispatch(int kernelIndex, int threadGroupsX, int threadGroupsY, int threadGroupsZ); 
```

第一個變數 `kernelIndex` 代表的是這次執行使用的計算核心，可以透過改變參數切換功能 （前提是你有定義多個核心）

三個 `threadGroups` 下一部分會講

```cs
ComputeShader compute;

compute.Dispatch(0, 1, 1, 1);
```

取得 kernelIndex 的方法

```cs
int index = compute.FindKernel("MyComputeKernel");
```

### num threads, thread group, SV_DispatchThreadID

每個計算核心前面都會需要定義 numthreads 欄位

並行便是由多個執行緒（或線程）

```hlsl
[numthreads(10, 1, 1)]
void CSMain (uint3 id : SV_DispatchThreadID)
{
    // TODO: insert actual code here!
}
```

定義 thread 的數量，

在 C# 的情況中類似這樣 

```cs
void Threads()
{
    for(int x = 0; x < numthreads.x; x ++)
    {
        for(int y = 0; y < numthreads.y; y ++)
        {
            for(int z = 0; z < numthreads.y; z ++)
            {
                CSMain();
            }
        }
    }
}
void CSMain() { }
```

提醒，這只是比喻，計算著色器中不會真的像迴圈那樣跑

threadGroups

public void Dispatch(int kernelIndex, int threadGroupsX, int threadGroupsY, int threadGroupsZ); 

和執行序有關的第二個地方便是 C# 端調用 Dispatch 時要輸入的三個變數 `threadGroupsX, Y, Z`

指定執行緒組的數量

換成 C# 迴圈 

```cs
void ThreadGroups()
{
    for(int x = 0; x < threadGroups.x; x ++)
    {
        for(int y = 0; y < threadGroups.y; y ++)
        {
            for(int z = 0; z < threadGroups.y; z ++)
            {
                Threads();
            }
        }
    }
}
void Threads() { }
void CSMain() { }
```

再次提醒，這只是比喻，計算著色器中不會真的像迴圈那樣跑

最終會執行的總數量為 threadGroups.xyz * numthreads.xyz

SV_DispatchThreadID 則是 for 的 i，

當前的 Group * numthread + 當前的 thread

```hlsl
void CSMain (uint3 id : SV_DispatchThreadID)
{
    // TODO: insert actual code here!
}
```



要分配幾個 groups，而每個 group 中又要有多少 thread 

groups 和 groups 之間也會並行 （待查證



這個比喻並不精確 幫助理解

如何定義數量？ 

視你的資料結構有多少軸像而定，如果是 [n, 1, 1]

如果是一張圖片的話就是二維 [x, y, 1]

如果三維的體積網格就會需要用到三個軸 [x, y, z]

實際要多少我也不太確定，總之數量夠就行，

一萬個元素就用 25 個 group 和 400 個 thread？

要處理 1024 * 1024 的圖片就用 (4, 4) 個 group 和 (256, 256) 個 thread

著色器中不會遇到 index out of range 的問題，所以不用擔心超過數量（除了少數情況會遇到問題，後面會講）

### 訪問資料

靜態 （只讀的全局參數）

和 操作資料 緩衝區資料

以繪圖系統為例 靜態參數就是筆刷大小、位置等

操作資料就是畫布上的像素

透過每個 thread 的 id 訪問自己要處裡的資料

將整張 Texture 的所有像素都填上指定顏色

```hlsl
float4 color;
RWTexture2D<float4> Result;

[numthreads(8, 8, 1)]
void CSMain (uint3 id : SV_DispatchThreadID)
{
    Result[id.xy] = color;
}
```

利用 ThreadID 進行操作也是行的，將陣列的元素與自己的索引相加 
將整個 float 陣列的每個元素加上數值

```hlsl
RWStructureBuffer<float> Result;

[numthreads(8, 1, 1)]
void CSMain (uint3 id : SV_DispatchThreadID)
{
    Result[id.x] = Result[id.x] + id.x;
}
```

變數的型別會在下一張節

## 資料傳遞

GPU 運算 使用的是 GPU 緩衝

而非 CPU 的記憶體或快取

兩者是不能直接互通的，而且傳遞成本是一個注意事項

因此任何資料操作錢都需要先傳遞至 GPU

### Texture

Texture2D 只讀 可以接收 Unity Texture, Texture2D

RWTexture2D <float4> Result; 讀寫 只接收 RenderTexture

Compute Shader 中訪問

### Buffer

StructuredBuffer

AppendStructuredBuffer

RWBuffer (Read 會造成阻塞)

對比圖

### Struct

能夠將資料包裝成 Struct

## 實作 範例

傳遞資料並拿回

傳遞資料並直接進渲染管線

GPU Instance, Culling

Animation Instance

要做的事、要傳遞的資料、要執行的方法



