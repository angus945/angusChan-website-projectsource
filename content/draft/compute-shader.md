---
title: "筆記 計算著色器"
date: 2022-05-14
lastmod: 2022-05-14

draft: false

description:
tags: [ComputeShader]

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

知道了 GPU Instance 和 GPU Culling，

尋找計算著色器資料

踏入 GPU 並行的世界了

但

不夠直觀

於是在

花幾個月 實做和研究了些東西後

所以這篇文就

以自己的理解解釋一次計算著色器

## 概括 -

計算著色器 (Compute Shader) 是一種位於於渲染管線之外，用途也不僅限於著色計算的獨立工具。目的在透過 GPU 的大量核心進行平行運算，以獲得效能。

計算著色器的兩大難點： <h> 並行運算 </h> 與 <h> 資料傳遞 </h>

### 並行運算 +

首先以重複執行函式為例子，假設要執行某項函式 10 次，在 CPU 語言中會透過迴圈執行。迴圈將會從 index = 1 到 10 依序線性執行，只有當前的迴圈內容被完整執行完後，才會進入下一次的迴圈。

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

而在著色器這種 GPU 語言中，函式則會交由十個獨立的執行緒 (thread) 進行運算，讓 GPU 的大量核心以平行的方式完成任務，執行時並無順序之分（亂序）。

```hlsl
[numthreads(10, 1, 1)]
void SomeFunction (uint3 id : SV_DispatchThreadID)
{
    //DoSomething
}
```

這裡用一張簡單的示意圖展示運作差異（注意和運行速度無關）

<!-- TODO 示意圖 -->

不過在計算著色器中，運作差異並不是真正的難點，如果有編寫材質著色器經驗的話，應該已經很熟悉平行運算這件事了。與材質著色器不同的點在於，計算著色器是獨立於渲染管線之外的系統，所以它也沒有 vertices shader 或 fragment shader 這種渲染管線提供的「框架」來提示該寫些什麼。

因此，真正的難點是在少了明確的目標後，我們只能靠自己判斷 <h> 有什麼問題是能透過並行解決的 </h> ，以及 <h> 該怎麼透過並行解決問題 </h> ，這也是初次接觸並行運算容易遇到的瓶頸。

### 資料傳遞 +

計算著色器的第二項難點：資料傳遞。

在常規的渲染著色器中，引擎管線會幫使用者處理完資料傳遞等問題。但同樣，更大的權力更大的責任，使用者對於計算著色有完全的控制權，資料傳遞的工作也包括在其中。

由於資料是在兩種不同環境中進行傳遞，因此資料從哪裡來、資料到哪裡去，該傳遞什麼資料以及該怎麼傳遞資料都是實做時需要面對的問題。在加上著色器本身的除錯難度，在遇到錯誤時，難以辨識究竟是資料傳遞出錯還是函式編寫有誤。

## 腳本結構 +

這是 Unity 中的預設 Compute Shader 腳本，這個章節就來逐步解析他的結構

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

### 計算核心 +

和名稱一樣，計算核心 (Kernel) 是計算著色器中的核心區塊，著色器的具體功能會在此處定義。透過 `#pragma kernel ___` 關鍵字宣告計算核心，就和 vert 和 frag 編寫時一樣，核心的名稱可以自由定義，但一定要有一個對應的函式實做才能運行。也可以根據需求定義一個以上的核心。

```hlsl
#pragma kernel MyComputeKernelA
#pragma kernel MyComputeKernelB
#pragma kernel MyComputeKernelC

void MyComputeKernelA (uint3 id : SV_DispatchThreadID) { }
void MyComputeKernelB (uint3 id : SV_DispatchThreadID) { }
void MyComputeKernelC (uint3 id : SV_DispatchThreadID) { }
```

### 多執行緒 +

並行便是由多個執行緒（或線程）

因此除了定義計算核心外，還需要透過 `[numthreads(x, y, z)]` 分配這個核心需要的執行緒數量 "num" "threads"。三個欄位分別代表維度軸 `xyz`，而計算著色器運作時也會透過 `SV_DispatchThreadID` 當前的執行緒 ID 傳入計算函式中。

```hlsl
[numthreads(10, 1, 1)]
void CSMain (uint3 id : SV_DispatchThreadID)
{
    // TODO: insert actual code here!
}
```

轉換成 CPU 語言中的迴圈看起來應該會更直觀。但請注意！這只是比喻，計算著色器中不會真的像迴圈那樣跑，而是以並行的方式亂序執行，別忘了最一開始的示意圖。

```cs
Vector3 numthreads = new Vector3(10, 1, 1);
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
void CSMain() 
{ 
    // TODO: insert actual code here!
}
```

至於為什麼會執行緒的數量需要三個維度軸呢？Microsoft 官方文檔是這樣說的：[numthreads](https://docs.microsoft.com/en-us/windows/win32/direct3dhlsl/sm5-attributes-numthreads)

> For example, if a compute shader is doing 4x4 matrix addition then numthreads could be set to numthreads(4,4,1) and the indexing in the individual threads would automatically match the matrix entries. The compute shader could also declare a thread group with the same number of threads (16) using numthreads(16,1,1), however it would then have to calculate the current matrix entry based on the current thread number.

簡單來說就是為了「方便」，視你要處裡的資料結構而定，多的維度軸可以幫使用者省去轉換工作，讓 ID 與資料欄位直接對應。在 CPU 語言中，如果要遍歷具有座標性質的資料時（如二維陣列 `int[,]`），透過兩層迴圈對應維度的 x, y 軸會更加輕鬆。

當然並行時也同理，假如我現在要處裡的是圖片資料，透過兩個維度軸直接對應至像素位置上，會比透過長寬換算來的方便，這就是為什麼計算著器起也允許分配多個軸向的執行緒數量。

### 執行緒組 +

即使定義了計算核心，Compute Shader 還是需要由使用者手動呼叫 [ComputeShader.Dispatch](https://docs.unity3d.com/ScriptReference/ComputeShader.Dispatch.html) 執行。

```cs
public void Dispatch(int kernelIndex, int threadGroupsX, int threadGroupsY, int threadGroupsZ); 
```

第一個變數 `kernelIndex` 代表的是這次 Dispath 要使用的計算核心，如果著色器中有定義複數的核心，便可由這裡進行選擇。可以使用 `FindKernel` 函式透過名稱尋找計算核心。

```cs
int knrnelIndex = compute.FindKernel("MyComputeKernel");

compute.Dispatch(knrnelIndex, 1, 1, 1);
```

Dispatch 還有三個輸入 `threadGroupsX,Y,Z`，意思這次運行是要分配的「執行緒組」數量 "thread" "Groups"（下面簡稱 "組"）。numthread 分配的是一個組裡面要有多少執行緒，而 threadGroups 則會指定一共使用多少組來運行，所以一次運行的最終次數便是 threadGroups * numthreads。

同樣，替換 CPU 語言中的迴圈看起來會更直觀。但也再次提醒，這只是比喻，別忘了一開始的對比圖。並且組和組之間也會並行，並非上一個組完成才會進入下一個組。

```cs
void ThreadGroups(int threadGroupsX, int threadGroupsY, int threadGroupsZ)
{
    for(int x = 0; x < threadGroupsX; x ++)
    {
        for(int y = 0; y < threadGroupsY; y ++)
        {
            for(int z = 0; z < threadGroupsZ; z ++)
            {
                Threads();
            }
        }
    }
}
void Threads() { }
void CSMain() { }
```

每個執行緒的 SV_DispatchThreadID 便是當前的組 * 執行緒數量 + 當前的執行緒，不過這些 ID 的計算 Compute Shader 都會幫我們完成，所以使用者只要分配好需要的數量即可。

至具體數量該怎麼分配呢？首先從處理資料的維度下手，如果是一維的資料陣列就分配 `(n, 1, 1)`、二維圖片的像素陣列就用 `(x, y, 1)`、三維的體積網格就 `(x, y, z)`。

執行緒的具體數量或比例則沒有明確規則，大概抓個資料總數 1% 吧？假設陣列長度大約一萬上下，numthread 就分配為 `(100, 1, 1)`、圖片大小 2048 的話就分配 `(20, 20, 1)`。

最後，組的數量可以透過資料長度除以執行緒數量得出，確保任何情況下都能分配足夠的組來運行著色器，畢竟資料的多寡可能根據情況產生差異。

```cs
compute.Dispatch(knrnelIndex, 1 + (array.Length / 100), 1, 1);
compute.Dispatch(knrnelIndex, 1 + (image.width / 20), 1 + (image.height / 20), 1);
```

著色器中訪問陣列時，不會因為 index out of range 出現錯誤而中斷，所以只需要確保分配的數量足夠即可。

<!-- out of bound 時的行為 ? -->

<!-- https://github.com/gpuweb/gpuweb/issues/35 ? -->

### 訪問資料 +

要透過計算著色器處理的資料主要會透過 Buffer 傳遞至 GPU，而存取 Buffer 資料的方法就和陣列一樣，透過索引值訪問特定欄位中的資料。

透過執行緒 ID 對應至圖片的每個像素，並將黑色寫入像素。

```hlsl
RWTexture2D<float4> Image;

[numthreads(8, 8, 1)]
void ClearImage (uint3 id : SV_DispatchThreadID)
{
    Image[id.xy] = float4(0, 0, 0, 1);
}
```

當然資料訪問也不僅限於自己的 ID，視需求也可以讀、寫其他欄位上的資料。例如時常應用在影像處裡中的卷積矩陣 (Kernel Convolution)，就會訪問周圍的像素資料來進行計算。下面是方框模糊的範例程式，將像素與周圍八格進行平均。

```hlsl
RWTexture2D<float4> Image;

[numthreads(8, 8, 1)]
void BoxBlur (uint3 id : SV_DispatchThreadID)
{
    float4 color = 0;
    for(int x = -1; x <= 1; x ++)
    {
        for(int y = -1; y <= 1; y ++)
        {
            color += Image[id.xy + float2(x, y)];
        }
    }
    
    Image[id.xy] = color / 9;
}
```

## 資料傳遞 -

GPU 運算 使用的是 GPU 緩衝

而非 CPU 的記憶體或快取

加上計算著色器是獨立於管線之外的

所以資料也需要手動控管

兩者是不能直接互通的，而且傳遞成本是一個注意事項

因此任何資料操作都需要先傳遞至 GPU

### 只讀參數 +

就和一般的渲染著色器一樣，計算著色器也可以傳入個別的參數用於計算。且同樣的，這些數值會被整個著色器共享（包括不同的計算核心），並且只讀。通常用於傳遞全域的屬性參數，如圖片大小、筆刷位置、顏色等。

```cs
compute.SetVector("_Resourection", resourction);
compute.SetVector("_BrushPos", mousePosition);
compute.SetVector("_BrushColor", color);
```

```hlsl
float2 _Resourection;
float2 _BrushPos;
float4 _BrushColor;
```

### 緩衝資料 +

也是計算著色器的主要目的，要透過計算著色器進行處理的資料，由 CPU 端分配 GPU 緩衝區，並傳遞給 Compute Shader 使用。

```cs
ComputeBuffer buffer = new ComputeBuffer(count, stride, ComputeBufferType);
```

`count` 代表的是資料有多少元素，也就是要傳入的陣列長度。`stride` 為一個元素的大小，可以透過 `sizeof()` 取得。而 `ComputeBufferType` 則是緩衝區的類別，根據需求使用不同的類型。

Buffer 有許多種類型，不過這裡就先著重在常用的兩種類型上：

+ **ComputeBufferType.Structured**  
    結構緩衝區，傳遞一般的陣列資料結構，讓著色器能夠讀寫內容。

+ **ComputeBufferType.Append**  
    添加緩衝區，傳遞一個容器緩衝區，允許在著色器中對它添加元素，通常用於過濾元素。
    <!-- TODO Out of range -->

假設我要將一個長度為 10000 的向量陣列傳入計算著色器，並對裡面的元素進行過濾的話，就會需要兩個緩衝區。緩衝區長度為 10000、元素大小為三個單精度浮點數，類型為 Structured, Append。

```cs
Vector3[] positions = new Vector3[10000];

sourceBuffer = new ComputeBuffer(positions.Length, sizeof(float) * 3, ComputeBufferType.Structured);
filteBuffer = new ComputeBuffer(positions.Length, sizeof(float) * 3, ComputeBufferType.Append);

buffer.SetData(positions);
```

建立完緩衝區後，還需要將它分配給計算著色器使用。不過與先前的只讀參數不同，緩衝資料需要指定給目標核心。不太需要擔心這個動作的開銷，因為在 setData 的時候資料傳遞就已經完成了，這裡只是將緩衝區位置的指標傳給著色器而已。

```cs
compute.SetBuffer(kernel, "sourceBuffer", sourceBuffer);
compute.SetBuffer(kernel, "filteBuffer", filteBuffer);
```

同樣著色器也需要對應的變數接收，並在 `<T>` 中指定緩衝區的資料型別。

```hlsl
StructuredBuffer<float3> sourceBuffer;
AppendStructuredBuffer<float3> filteBuffer;
```

也可以透過結構包裝多重變數，一次傳遞複合資料。

```hlsl
struct transform
{
    float3 position;
    float3 rotation;
    float3 scale;
};

StructuredBuffer<transform> transforms;
```

除此之外，結構緩衝區還有一種 `RWStructuredBuffer<T>`，這種緩衝區會允許計算核心將寫入資料，視需求使用。

<!-- https://docs.unity3d.com/ScriptReference/ComputeBufferType.html -->

### 貼圖資料 +

除了傳遞一維陣列進緩衝區外，計算著色器也能接受圖片資料，將二維的像素陣列傳入計算著色器使用。透過 `SetTexture()` 函式傳遞圖片至著色器中，和緩衝資料一樣需要指定計算核心。

```cs
compute.SetTexture(kernel, "image", image);
```

在著色器中同樣需要有對應的變數接收，並在 `<T>` 欄位指定通道數量與精度，`float, fixed3, half4` 等等。

```hlsl
Texture2D<fixed4> image;
```

和一般著色器的 `sampler2D` 不同，`Texture2D<T>` 是透過座標直接訪問特定的像素，而非 Tex2D 的 uv 採樣。
<!-- 不確定會不會受 filter mode, mipmap 的引響?  -->

```hlsl
void CSMain (uint3 id : SV_DispatchThreadID)
{
    fixed4 pixel = image[id.xy];
}
```

`Texture2D<T>` 為只讀，如果要允許寫入像素的話需要用 `RWTexture2D<T>`。要注意的是讀寫貼圖只能傳入 `RenderTexture`，原理和建立緩衝區時一樣，建立渲染貼圖時也會做分配空間的工做，才能讓著色器寫入數值。

## 實作範例

回到最一開始，有什麼問題是 <h> 能透過並行解決的 </h> ，以及 <h> 該怎麼透過並行解決問題

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

如果問題能夠被拆分為獨立且重複的小塊，便能透過並行解決。

傳遞資料並拿回

最後的章節䟬透過各種範例將上面的部份串起來

傳遞資料並直接進渲染管線

GPU Instance, Culling

Animation Instance

要做的事、要傳遞的資料、要執行的方法


### 陣列計算 -

+ 要解決什麼問題：將陣列中每個元素的數值 + 10
+ 要怎麼解決問題：以多個 thread 對應到陣列的所有元素上，並各自執行 +10 的動作

- 資料從哪裡來：C# (CPU) > ComputeShader (GPU)
- 資料到哪裡去：ComputeShader (GPU) > C# (CPU)

+ 要傳遞什麼資料：C# int array
+ 要怎麼傳遞資料：RWStructuredBuffer

```cs
//AddValues.cs
public class AddValues : MonoBehaviour
{
    [SerializeField] ComputeShader compute = null;
    [SerializeField] int[] array = new int[] { 0, 1, 2, 3, 4, 5, 6 };

    void Start()
    {
        ComputeBuffer buffer = new ComputeBuffer(array.Length, sizeof(int), ComputeBufferType.Structured);
        buffer.SetData(array);

        int kernel = compute.FindKernel("AddValueKernel");
        compute.SetBuffer(kernel, "valuesBuffer", buffer);
        compute.Dispatch(kernel, Mathf.CeilToInt(array.Length / 10f), 1, 1);
        
        buffer.GetData(array);
    }
}
```

```hlsl
// AddValues.compute

#pragma kernel AddValueKernel

RWStructuredBuffer<int> valuesBuffer;

[numthreads(10, 1, 1)]
void AddValueKernel (uint3 id : SV_DispatchThreadID)
{
    valuesBuffer[id.x] = valuesBuffer[id.x] + 10;
}
```

### 資料過濾 -

+ 要解決什麼問題：判斷陣列中的元素，過濾出於原點半徑 radius 以內的元素
+ 要怎麼解決問題：對每個元素進行各自判斷，將距離小於 radius 的元素加入 AppendBuffer，達成過濾目的

- 資料從哪裡來：C# (CPU) > ComputeShader (GPU)
- 資料到哪裡去：ComputeShader (GPU) > C# (CPU)

+ 要傳遞什麼資料：C# Vector2 Array
+ 要怎麼傳遞資料：RWStructuredBuffer, AppendBuffer

```cs
public class FilteElement : MonoBehaviour
{
    [SerializeField] ComputeShader compute = null;

    [SerializeField] float radius = 5;
    [SerializeField] Vector2[] array = new Vector2[] 
    {
        new Vector2( 0,  5),
        new Vector2( 1,  2),
        new Vector2( 8,  3),
        new Vector2(-9,  0),
        new Vector2(-1, -3),
    };
    [SerializeField] Vector2[] result = null;

    void Start()
    {
        result = new Vector2[array.Length];
        
        ComputeBuffer sourceBuffer = new ComputeBuffer(array.Length, sizeof(float) * 2, ComputeBufferType.Structured);
        ComputeBuffer resultBuffer = new ComputeBuffer(array.Length, sizeof(float) * 2, ComputeBufferType.Append);
        sourceBuffer.SetData(array);

        int kernel = compute.FindKernel("FilteKernel");
        
        compute.SetFloat("_Radius", radius);
        compute.SetBuffer(kernel, "sourceBuffer", sourceBuffer);
        compute.SetBuffer(kernel, "resultBuffer", resultBuffer);
        
        resultBuffer.SetCounterValue(0);

        compute.Dispatch(kernel, Mathf.CeilToInt(array.Length / 10f), 1, 1);

        sourceBuffer.GetData(array);
        resultBuffer.GetData(result);
    }
}
```

```hlsl
#pragma kernel FilteKernel

float _Radius;
RWStructuredBuffer<float2> sourceBuffer;
AppendStructuredBuffer<float2> resultBuffer;

[numthreads(10, 1, 1)]
void FilteKernel (uint3 id : SV_DispatchThreadID)
{
    float2 position = sourceBuffer[id.x];
    float distance = length(position);

    if(distance < _Radius)
    {
        resultBuffer.Append(position);
    }
}
```

<!-- ### 影像模糊

+ 要解決什麼問題：
+ 要怎麼解決問題：

- 資料從哪裡來：C# (CPU) > ComputeShader (GPU)
- 資料到哪裡去：ComputeShader (GPU) > RenderPipleline (GPU)

+ 要傳遞什麼資料：
+ 要怎麼傳遞資料： -->

## 感謝閱讀

### 更多例子 -

比較實際的範例放進來會太長， 給關鍵字

GPU Instance, GPU Culling
透過 資料過濾 將超出視錐範圍的物件剔除

GPU Ray Tracing
http://blog.three-eyed-games.com/2018/05/03/gpu-ray-tracing-in-unity-part-1/

GPU Line, cloth simulation 
透過每個節點的動向，模擬出現段或布料材質

GPU Slime Simulations
模擬一堆 agent
https://youtu.be/X-iSQQgOd1A

GPU Fluid Simulations
網格平行運算
https://www.youtube.com/watch?v=qsYE1wMEMPA

### 參考資料 -

https://docs.microsoft.com/zh-tw/windows/win32/direct3dhlsl/sm5-attributes-numthreads
