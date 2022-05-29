---
title: "【筆記】入門重點，計算著色器"
date: 2022-05-14
lastmod: 2022-05-14

draft: false

description:
tags: [Unity, ComputeShader]

## image for preview
# feature: 

## image for open graph
# og: "/post/about-learning/featured.jpg"

## when calling "resources" shortcode, well link to static folder with this path 
resources: /learn/shader/compute-shader/

## customize page background
background: "none"

## listout with recommand, new and all pages
# listable: [recommand, new, all]
---

<!-- TODO Colors -->

## 概括 +

計算著色器 (Compute Shader) 是一種位於於渲染管線之外，用途也不僅限於著色計算的獨立工具，目的在透過 GPU 的大量核心進行平行運算，以獲得效能。正式開始前先稍微帶過計算著色器的兩大難點： <h> 並行運算 </h> 與 <h> 資料傳遞 </h>

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

這是 Unity 中的預設 Compute Shader 腳本，這個章節就來逐步解析他的結構。

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

## 資料傳遞 +

資料傳遞，計算著色器的第二項重點。著色器是透過 GPU 進行運算的，運算過程中使用的資料也是存放在 GPU 的緩衝區 (Buffer) 當中。GPU 與 CPU 使用的空間不同，因此兩者的資料也不是直接相通的，任何想在著色器中的操作資料都需要先先傳遞至緩衝區中。

而在少了管線幫助的計算著色器中，資料的傳遞也需要由使用者手動控管。

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

假設我要將一個長度為 10000 的向量陣列傳入計算著色器，並對裡面的元素進行過濾的話，就會需要兩個緩衝區。緩衝區長度為 10000、元素大小為三個單精度浮點數，類型為 Structured, Append。

```cs
Vector3[] positions = new Vector3[10000];

sourceBuffer = new ComputeBuffer(positions.Length, sizeof(float) * 3, ComputeBufferType.Structured);
filteBuffer = new ComputeBuffer(positions.Length, sizeof(float) * 3, ComputeBufferType.Append);
```

透過 SetData 將資料存入緩衝區當中。
```cs
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

除此之外，結構緩衝區還有一種 `RWStructuredBuffer<T>`，這種緩衝區會允許計算核心將資料寫入緩衝區，視需求使用。

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

## 實作範例 +

回到最一開始的問題，有什麼問題是能透過並行解決的，以及該怎麼透過並行解決問題？無論是計算核心的編寫方法，還是代換成 C# 中迴圈的形式，他們都表現出了一個共同點：重複執行相似的工作。

```cs
for(int i = 0; i < 10; i ++)
{
    SomeFunction(i);
}
SomeFunction(int index) { }
```

意思是，如果要解決的問題能夠被拆分為個別獨立並且高度相似的片段，就能透過重複執行相似工作的方法完成，無論是透過迴圈線性執行，或是將每個片段分配給獨立的執行緒，以並行的方式達成任務。

最後的章節就透過各種範例將文中提到的各項重點串起，問題拆分、資料傳遞、解決問題，逐步分析如何使用計算著色器，透過並行的方式達成任務。

{{< resources/assets "examples" "如果想直接觀看完整腳本也可以點我" >}}

### 回顧腳本 +

首先，回顧一次預設的計算著色器結構，分析一下這個著色器做了哪些事，以及要傳遞什麼資料，和要怎麼使用這個腳本。

宣告了一個計算核心，名稱叫做 CSMain。

```hlsl
#pragma kernel CSMain
```

定義一個讀寫貼圖給計算著色器使用，精度為 float，通道數量 4 個。

```hlsl
RWTexture2D<float4> Result;
```

指定著色器要使用的執行序數量，由於訪問資料的維度軸為二維（圖片、像素資料），因此數量的格式為 `(x, y, 1)`。
```hlsl
[numthreads(8,8,1)]
```

實做計算核心的函式，名稱對應一開始宣告的 CSMain 核心。透過多個執行緒，對應到圖片資料 Result 的每個像素上，並根據像素的座標（也就是 id）寫入計算過後的像素數值。（先忽略計算式的原理，那不是這裡的重點）

```hlsl
void CSMain (uint3 id : SV_DispatchThreadID)
{
    // TODO: insert actual code here!

    Result[id.xy] = float4(id.x & id.y, (id.x & 15)/15.0, (id.y & 15)/15.0, 0.0);
}
```

回到 C# 處，接著來看看如何使用這個預設著色器。首先要尋找著色器中定義的計算核心 CSMain。

```cs
int kernel = compute.FindKernel("CSMain");
```

接著建立 RenderTexture，並傳入計算著色器的 Result 當中，提供著色器使用。
```cs
    resultTex = new RenderTexture(1024, 1024, 0, RenderTextureFormat.Default);
    resultTex.enableRandomWrite = true;
    resultTex.Create();
```

最後，調用著色器執行指定的計算核心。由於著色器中指定的執行序數量為 8，因此執行時必須將組的數量分配至圖片大小 / 8 才會足夠。
```cs
compute.Dispatch(kernel, 1 + (resultTex.width / 8), 1 + (resultTex.height / 8), 1);
```

運作結果如下，這是一個能繪製分型的計算著色器。

{{< resources/image "example-0.jpg" "50%" >}}

### 陣列計算 +

看完了預設的著色器，現在輪到我們解決自己的問題，嘗試透過平行運算對陣列元素進行操作。一步一步來，首先是：

**1. 要解決什麼問題**

透過並行運算將陣列中每個元素的數值 + n

**2. 要怎麼傳遞資料**

首先透過 SetInt 函式將要添加的數值 n 傳入著色器當中。

```cs
int addition;

compute.SetInt("_Addition", addition);
```

接著透過 ComputeBuffer 分配 GPU 緩儲存空間，將要進行操作的陣列資料存入緩衝區，並指定給計算著色器。

```cs
int[] array;

ComputeBuffer buffer = new ComputeBuffer(array.Length, sizeof(int), ComputeBufferType.Structured);
buffer.SetData(array);

compute.SetBuffer(kernel, "valuesBuffer", buffer);
```

**3. 要怎麼解決問題**

將問題拆分為相似的片段，透過重複執行的方式解決問題。在這個例子中便是以多個執行緒分別對應到陣列的所有元素上，並各自執行 + n 的動作。

```hlsl
void AddValueKernel (uint3 id : SV_DispatchThreadID)
{
    buffer[id.x] = buffer[id.x] + _Addition;
}
```

由於資料維度為一維陣列，因此執行序數量的格式為 `(n, 1, 1)`。

```hlsl
[numthreads(10, 1, 1)]
```

呼叫計算著色器執行計算，組的數量為陣列數量 / 10。

```cs
compute.Dispatch(kernel, 1 + (array.Length / 10f), 1, 1);
```

**4. 要怎麼使用資料**

在運算完成後，透過 GetData 取得緩衝區資料，用於檢視效果。

```cs
int[] result = new int[array.Length];

buffer.GetData(result);
```

{{< resources/image "example-1.jpg" "80%" >}}

### 資料過濾 +

第二個範例，透過計算著色器進行資料過濾。首先：

**1. 要解決什麼問題**

透過並行運算對陣列中的元素進行過濾，找出位於指定範圍中的向量元素 

**2. 要怎麼傳遞資料**

首先是作為範圍參考的兩個向量，透過 `SetVector` 傳遞。

```cs
Vector2 rangeMin, rangeMax;
compute.SetVector("_RangeMin", rangeMin);
compute.SetVector("_RangeMax", rangeMax);
```

接著分配 GPU 除存空間，建立兩個緩衝區，一個用於傳遞原始陣列進著色器 `Structured`，另一個則作為除存過濾後元素的容器 `Append`。並指定給計算著色器使用。

```cs
Vector2[] array;

ComputeBuffer sourceBuffer = new ComputeBuffer(array.Length, sizeof(float) * 2, ComputeBufferType.Structured);
ComputeBuffer resultBuffer = new ComputeBuffer(array.Length, sizeof(float) * 2, ComputeBufferType.Append);
sourceBuffer.SetData(array);

compute.SetBuffer(kernel, "sourceBuffer", sourceBuffer);
compute.SetBuffer(kernel, "resultBuffer", resultBuffer);
```

傳遞陣列長度給著色器，用於防止執行緒數量超出陣列長度時產生的非預期結果。

```cs
compute.SetInt("_ElementCount", array.Length);
```

**3. 要怎麼解決問題**

以多個執行緒對應到陣列的所有元素上，判斷元素是否大於範圍最小值，同時小於範圍最大值，並將符合條件的元素加入結果緩衝區中。

```hlsl
void FilteKernel (uint3 id : SV_DispatchThreadID)
{    
    float2 position = sourceBuffer[id.x];

    if(position.x < _RangeMin.x) return;
    if(position.y < _RangeMin.y) return;
    if(position.x > _RangeMax.x) return;
    if(position.y > _RangeMax.y) return;

    resultBuffer.Append(position);
}
```

雖然計算著色氣在訪問緩衝區的資料時不會因為超出長度而出錯，但在使用到 AppendBuffer 的情況下，多出的長度可能是使計算著色器將非預期的元素存入緩衝區，因此需要透過防呆判斷避免這件事發生。

```hlsl
void FilteKernel (uint3 id : SV_DispatchThreadID)
{    
    if(id.x >= _ElementCount) return;

    // codes ...
}

```

由於資料維度為一維陣列，因此執行序數量的格式為 `(n, 1, 1)`。

```hlsl
[numthreads(10, 1, 1)]
```

最後，呼叫著色器執行計算。

```cs
compute.Dispatch(kernel, 1 + (array.Length / 10), 1, 1);
```

**4. 要怎麼使用資料**

運算完成後，透過 GetData 取得緩衝區資料，用於檢視效果

```cs
Vector2[] result = new Vector2[array.Length];

resultBuffer.GetData(result);
```

{{< resources/image "example-2.jpg" "80%" >}}

### 更多例子 +

上面用了兩個簡單的例子展示如何編寫自己的計算著色器，不過要注意這並不是「真正」應用計算著色器時會使用的作法。由於 CPU 與 GPU 間的資料傳遞成本高昂，實際應用時不會像範例中透過 GetData 將資料取回 C#，而是直接讓渲染管線使用這些資料。

例如傳入 [Graphics.DrawMeshInstancedIndirect](https://docs.unity3d.com/ScriptReference/Graphics.DrawMeshInstancedIndirect.html) 讓 Unity 進行 GPU Instance，或是透過計算著色器將結果繪製到 RenderTexture 中，再利用 ImageEffectShader 渲染到畫面上。可惜的是更實際的範例放進來會讓篇幅太長，所以這裡就先提供一些實際應用的例子，讓有興趣深入的人自行研究。

**Conway's Game of Life**  
康威生命遊戲，每個單位格都是一個細胞，以獨立的回合為時間單位，在每個回合中細胞都會根據周圍的環境狀態來決定自己將會存活還是死亡。屬於比較好分辨出如何並行的例子。

{{< resources/image "conway's-game-of-life.gif" >}}

具體遊戲規則可以參考 [Wiki](https://zh.wikipedia.org/zh-tw/%E5%BA%B7%E5%A8%81%E7%94%9F%E5%91%BD%E6%B8%B8%E6%88%8F)。

**GPU Slime Simulations**  
透過計算著色器模擬大量的單位，並讓這些單位以簡單的行為互相交互，產生有趣的結果。屬於比較好玩的例子。

{{< resources/image "slime-simulations.gif" "80%" >}}

參考影片 [Coding Adventure: Ant and Slime Simulations](https://youtu.be/X-iSQQgOd1A)

**GPU Culling**  
與 GPU Instance 搭配使用的技術，透過計算著色器進行視錐剃除，過濾出在攝影機視角內的物件，達成更高效的渲染優化。是比較實際而且簡單的例子。

{{< resources/image "compute-culling.gif" >}}

更多細節可以參考此篇文章 [Unity中使用ComputeShader做视锥剔除（View Frustum Culling）](https://zhuanlan.zhihu.com/p/376801370)。

**GPU Ray Tracing**  
將環境、物件與材質等資料傳入計算著色器，直接透過自訂的方法進行渲染，並將結果輸出至畫面上。方法不侷限於光線追蹤，任何以螢幕像素為單位的並行都可以使用（如射線邁進），是比較實際但也有難度的運用。

{{< resources/image "ray-tracing.jpg" "50%" >}}

參考資料 [GPU Ray Tracing in Unity](http://blog.three-eyed-games.com/2018/05/03/gpu-ray-tracing-in-unity-part-1/)

## 感謝閱讀 +

在知道了 GPU Instance 和 GPU Culling ，我也接觸到計算著色器這項工具了，正式踏入 GPU 並行的世界。但查了不少資料感覺都不夠直觀，不然就是一口氣跳到太深的內容（像是直接教 RayTracing 的文章）。

於是在花幾個月實做和研究各項些東西後，嘗試用自己的理解重新解釋一次計算著色器，這篇筆記就是我整理出關於計算著色器的幾項重點，在這裡分享給各位，如果有任何建議都歡迎提出。

### 參考資料 +

[numthreads](https://docs.microsoft.com/zh-tw/windows/win32/direct3dhlsl/sm5-attributes-numthreads)

[Unity中ComputeShader的基础介绍与使用](https://zhuanlan.zhihu.com/p/368307575)

[Coding Adventure: Compute Shaders](https://youtu.be/9RHGLZLUuwc)

[Getting Started with Compute Shaders in Unity](https://www.youtube.com/watch?v=BrZ4pWwkpto)
