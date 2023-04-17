---
title: "Render Feature"
date: 2023-04-17T09:03:10+08:00
# lastmod: 2023-04-17T09:03:10+08:00

show-title: true
show-meta: true

draft: true

description:
tags: []

socialshare: true

## image for preview
# feature: "/article/about-learning/featured.jpg"

## image for open graph
# og: "/article/about-learning/featured.jpg"

## when calling "resources" shortcode, well link to static folder with this path 
resources: /learn/scriptable-render-pipeline/render-feature/

## customize page background
# background: [watercolor-A] 

## listout with recommand, new and all pages
# listable: [recommand, all]

# sitemap_ignore: true
---

## SRP

允許開發者更方便的擴展渲染管線

但不需要接觸到太底層的管線程式碼

比較好接觸的實用

URP 中提供的

這篇筆記適合已經有 Shader 基礎，了解渲染管線基礎知識

想開始接觸 SRP 的人

<!--more-->

<!-- &nbsp; -->

<!-- [text]({ ref "relpath" })。 -->

### 環境設定 -

為了避免未知問題，請確保版本與環境一致

版本 Unity 2021.3.22f1

注意不要用 URP 模板建立專案 可能遇到問題

3D Core (3D 核心)

{{< resources/image "setup-create.jpg" >}}

導入 URP

{{< resources/image "setup-install.jpg" >}}

建立 PipelineAsset

{{< resources/image "setup-pipeline-asset.jpg" >}}

設置管線

{{< resources/image "setup-pipeline.jpg" >}}


## 基本資訊 -

在建立時出現的 Render Data，裡面包括基礎的渲染設定 Layer, Path, Shadow 等等

最下面有一個 AddRenderFeature 就是今天的主角

{{< resources/image "basis-render-data.jpg" >}}

點擊後會出現一些選項，是 URP 中預設的

有些不用程式碼的效果能直接實現 例如被遮擋的物體

但我們先深入 等等再來談效果與範例 層次結構

管線的核心功能，可能包括渲染物件、光照、陰影等處理

Feature 則是附加在管線上的「擴展」功能，而 Pass 則是擴展功能的實做。

管線可以有多個擴展，而每個擴展也可以有複數個實做內容

{{< resources/image "basis-hierarchy.png" "40%" >}}

<!-- TODO 換更好的圖 -->

### 擴展管線 -

首先，擴展管線需要建立一個 繼承 `ScriptableRendererFeature` 的類別

需要實做兩個函式 `Create()` 與 `AddRenderPasses()`。 `Create()` 會在 遊戲初次載入時調用，用來給 Render Feature 初始化內容

`AddRenderPasses()` 每一幀都會被調用，用來給渲染管線添加自訂命令

```csharp
using UnityEngine.Rendering;
using UnityEngine.Rendering.Universal;

public class CustomRenderFeature : ScriptableRendererFeature 
{
    public override void Create()
    {

    }
    public override void AddRenderPasses(ScriptableRenderer renderer, ref RenderingData renderingData)
    {

    }
}
```

開啟資料夾中的 Pipeline Asset 可以 Add Render Feature

這樣就成功在管線上添加了擴展功能

{{< resources/image "basis-feature-add.jpg" "80%" >}}

### 擴展實做 -

實做擴展功能 我們必須建立一個 Pass

想成在渲染管線中的 一次渲染命令 而 ScriptableRenderPass 則是一種自訂義渲染命令的手段

<!-- 用繪圖來說 可以想像成一筆畫？ -->

建立一個類別，繼承 `ScriptableRenderPass`

```csharp
using UnityEngine.Rendering;
using UnityEngine.Rendering.Universal;

class CustomRenderPass : ScriptableRenderPass
{
    public CustomRenderPass()
    {
        // renderPassEvent = RenderPassEvent.AfterRenderingOpaques;
    }
    public override void Execute(ScriptableRenderContext context, ref RenderingData renderingData)
    {

    }
}
```

需要實作一個 Execute 函式 用來編寫 Pass 要執行的命令 他會在每禎調用 我們會將要執行的命令傳入 ScriptableRenderContext context 當中

在 Unity 中，我們會用 CommandBufer 保存 GPU 命令 透過 CommandBufferPool 取得 添加命令，

context.ExecuteCommandBuffer 會將 而是將命令排進管線的更底層中，等實際渲染的時候調用

最後當命令傳遞完畢後，就能釋放用完的 Buffer

```csharp
public override void Execute(ScriptableRenderContext context, ref RenderingData renderingData)
{
    CommandBuffer command = CommandBufferPool.Get("Command");

    //command.DoSomeThing();

    context.ExecuteCommandBuffer(command);

    CommandBufferPool.Release(command);
}
```

回到 Feature

```cs.CustomRenderFeature
public class CustomRenderFeature : ScriptableRendererFeature
{
    CustomRenderPass renderPass;

    public override void Create()
    {
        renderPass = new CustomRenderPass();
    }
    public override void AddRenderPasses(ScriptableRenderer renderer, ref RenderingData renderingData)
    {
        renderer.EnqueuePass(renderPass);
    }
}
```

如此一來，基本的設置模板就完成了 但目前仍未有任何效果 因為我們沒有在 CommandBuffer 中天加任何命令

### 渲染物件

假設我想渲染一個物體

設置資源

```cs.CustomRenderPass
Mesh mesh;
Matrix4x4 transform;
Material material;

public void SetRenderObject(Mesh mesh, Matrix4x4 transform, Material material)
{
    this.mesh = mesh;
    this.transform = transform;
    this.material = material;
}
```

```cs.CustomRenderPass
if(mesh != null && material != null)
{
    command.DrawMesh(mesh, transform, material);
}
```



顯示屬性





<!-- TODO -->

### 訪問資料

<!-- TODO 要放哪? 使用 Inspector 修改資料會重建 Feature -->

GraphicsSettings 與 QualitySettings 可以訪問到當前的渲染管線資料，但是 ScriptableRendererData 是封裝的，所以要靠反射? 取得，原理不清楚

取得之後就能得到 rendererFeatures，可以再透過名稱取得特定的資料

```csharp
RenderPipelineAsset pipelineAsset = GraphicsSettings.renderPipelineAsset;
//RenderPipelineAsset pipelineAsset = (RenderPipelineAsset)QualitySettings.renderPipeline;

FieldInfo propertyInfo = pipelineAsset.GetType().GetField("m_RendererDataList", BindingFlags.Instance | BindingFlags.NonPublic);
ScriptableRendererData renderData = ((ScriptableRendererData[])propertyInfo?.GetValue(pipelineAsset))?[0];

List<ScriptableRendererFeature> features = renderData.rendererFeatures;
GPUInstenceFeature feature = features.Find(n => n.name == "FeatureName") as GPUInstenceFeature;
```

[https://blog.csdn.net/boyZhenGui/article/details/125974779](https://blog.csdn.net/boyZhenGui/article/details/125974779)

### 開關效果

能透過程式開關特定 Feature

```csharp
feature.SetActive();
```

或是修改 Feature 中的屬性，但需要建立對應的接口才行

```csharp
CustomRenderFeature customFeature = feature as CustomRenderFeature;
customFeature.SetShader("Custom/Blur");
```

```csharp
public void SetShader(string v)
{
    material = new Material(Shader.Find(shaderName));
}
```

### 添加移除 

盡量不要

OnDisable 必須

```csharp
{
    CustomRenderFeature addFeature = ScriptableObject.CreateInstance<CustomRenderFeature>();
    addFeature.name = "AddedFeature";

    renderData.rendererFeatures.Add(addFeature);
    addFeature.SetShader("Custom/Blur");
}
void OnDisable()
{
    ScriptableRendererFeature removeFeature = renderData.rendererFeatures.Find(n => n.name == "AddedFeature");
    renderData.rendererFeatures.Remove(removeFeature);
}
```

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/563c472e-5c60-41ec-b560-5f4b79e11097/Untitled.png)

## 範例

### 畫面處理

與 Built in 不同，不能在 OnRenderImage 寫後處理 

沒那麼方便，但相對有更高的維護性與擴展性

後處理使用的材質球

`RenderTargetIdentifier` 儲存 RT 的指標 各種擴展管線 取的儲存渲染目標都會使用

`RenderTargetHandle` 著色器變數的指標，也可以儲存 RT ，但需要先被定義

初始化 傳入材質球與設定

以及 Pass 的執行時機 renderPassEvent 

```csharp
public class CustomRenderPass : ScriptableRenderPass
{
    Material material;
    RenderTargetIdentifier sourceTexture;
    RenderTargetHandle tempTexture;

    public RenderPass(Material material) : base()
    {
        this.material = material;
        tempTexture.Init("_TempTexture");

        renderPassEvent = RenderPassEvent.AfterRenderingPostProcessing;
    }
}
```

RenderPassEvent 當中包括各種渲染順序

傳遞圖片的來源 

```csharp
public void SetSource(RenderTargetIdentifier source)
{
    this.sourceTexture = source;
}
```

- [ ]  `tempTexture.Init(””)` 中間字串是 Shader Prop 名稱，但 Shader 不需要建立對應?

`CommandBufferPool.Get("Name")` 取得 CommandBuffer 並命名

`command.GetTemporaryRT(id, cameraTextureDesc, FilterMode.Bilinear);`

`Blit()` 將 RT 從來源複製到目標上，並經過 Shader

Blit 不允許寫入自己，所以要執行兩次，一次是經過 Shader 的效果，第二次是單純複製回去

`context.ExecuteCommandBuffer(buffer);`

執行 Buffer 中的命令

`CommandBufferPool.Release(buffer);`

釋放用完的 buffer

```csharp
public override void Execute(ScriptableRenderContext context, ref RenderingData renderingData)
{
    CommandBuffer command = CommandBufferPool.Get("Command");

    RenderTextureDescriptor cameraTextureDesc = renderingData.cameraData.cameraTargetDescriptor;
    cameraTextureDesc.depthBufferBits = 0;
    command.GetTemporaryRT(tempTexture.id, cameraTextureDesc, FilterMode.Bilinear);

    command.Blit(sourceTexture, tempTexture.Identifier(), material, 0);
    command.Blit(tempTexture.Identifier(), sourceTexture);
    //Blit(command, sourceTexture, tempTexture.Identifier(), material, 0);
    //Blit(command, tempTexture.Identifier(), sourceTexture);

    context.ExecuteCommandBuffer(command);

    CommandBufferPool.Release(command);
}
```

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/8f3f8bbf-9d2c-4351-ac64-412cb5aaab86/Untitled.png)

[https://docs.unity3d.com/ScriptReference/Rendering.ScriptableRenderContext.ExecuteCommandBuffer.html](https://docs.unity3d.com/ScriptReference/Rendering.ScriptableRenderContext.ExecuteCommandBuffer.html)

在渲染完畢時調用，用於釋放 RT

在繪製完畢後 清除的命令

他會把清除命令的 commandBuffer 傳入 給你添加命令

不需要自己 Get 或 Release

```csharp
public override void FrameCleanup(CommandBuffer cmd)
{
    cmd.ReleaseTemporaryRT(tempTexture.id);
}
```

回到 Feature 設置

```csharp
[SerializeField] string shaderName;
CustomRenderPass pass;

public override void Create()
{
    pass = new CustomRenderPass(new Material(Shader.Find(shaderName)));
}
public override void AddRenderPasses(ScriptableRenderer renderer, ref RenderingData renderingData)
{
    pass.SetSource(renderer.cameraColorTarget);

    renderer.EnqueuePass(pass);
}
```

建立一個 Shader, Custom/Desaturate，回到 Inspector 設置 ShaderName 就會有效果了

```csharp
fixed4 frag (v2f i) : SV_Target
{
    fixed4 col = tex2D(_MainTex, i.uv);
    return Luminance(col);
}
```

![螢幕擷取畫面 2023-04-11 165315.jpg](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/6d4a9c3f-9c62-42f2-91e2-c9ec15fedc2a/%E8%9E%A2%E5%B9%95%E6%93%B7%E5%8F%96%E7%95%AB%E9%9D%A2_2023-04-11_165315.jpg)

[https://youtu.be/MLl4yzaYMBY](https://youtu.be/MLl4yzaYMBY)

### 批量繪製

也可以把 GPU instance 轉移到 Render Feature 中

基本上作法和一般的沒兩樣 只是 Graphics 命令改成用 CommandBuffer

跳過基本的計算著色器內容

```csharp
class GPUInstancePass : ScriptableRenderPass
{
    //other codes ...

    public override void Execute(ScriptableRenderContext context, ref RenderingData renderingData)
    {
        CommandBuffer command = CommandBufferPool.Get("Command");

        command.SetBufferCounterValue(resultBuffer, 0);
        command.DispatchCompute(compute, kernel, (instanceCount / 640 + 1), 1, 1);
        command.CopyCounterValue(resultBuffer, argsBuffer, sizeof(uint));
        command.DrawMeshInstancedIndirect(instanceMesh, 0, material, 0 , argsBuffer);

        context.ExecuteCommandBuffer(command);

        CommandBufferPool.Release(command);
    }
}
```

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/f4ec70db-60cd-46f3-94ae-9e2df8e863a3/Untitled.png)

---

[https://youtu.be/EB5HiqDl7VE](https://youtu.be/EB5HiqDl7VE)

[Unity - Scripting API: Mesh.GetVertexBuffer](https://docs.unity3d.com/ScriptReference/Mesh.GetVertexBuffer.html)

vertex buffer?

[Unity - Scripting API: Mesh.GetVertexBuffer](https://docs.unity3d.com/ScriptReference/Mesh.GetVertexBuffer.html)

https://docs.google.com/document/d/1_YrJafo9_ZsFm4-8K2QlD0k3RgwZ_49tSA84paobfcY/edit#

SkinnedMeshRenderer

[https://github.com/Unity-Technologies/MeshApiExamples](https://github.com/Unity-Technologies/MeshApiExamples)

修改 GPU 中的共用 vertex buffer

```csharp
Debug.Log(mesh.GetVertexBufferStride(0));
Debug.Log(mesh.GetVertexAttribute(0));
Debug.Log(mesh.GetVertexAttribute(1));
Debug.Log(mesh.GetVertexAttribute(2));
Debug.Log(mesh.GetVertexAttribute(3));
Debug.Log(mesh.GetVertexAttribute(4));
```

Plane, Quad

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/6345c6d2-71cd-4fee-90bd-105a3542a55d/Untitled.png)

Sphere, Cube, Cylinder, Capsule

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/8faa79f7-14e0-4d3b-b10e-f750d52f4511/Untitled.png)

- attr = 屬性
- fmt = 格式
- dim = 維度
- stream = ??

- Position

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/57195604-0a6a-461c-8a38-c6d98fe43839/Untitled.png)

透過檢查 知道有沒有錯誤

```glsl
int _BufferStride;
int _VertexCount;

[numthreads(64,1,1)]
void CSMain (uint3 id : SV_DispatchThreadID)
{
    if(id.x >= _VertexCount) return;

    uint3 rawVertex = vertexBuffer.Load3(id.x * _BufferStride);
    float3 vertex = asfloat(rawVertex);

    uint3 rawNormal = vertexBuffer.Load3(id.x * _BufferStride + 12);
    float3 normal = asfloat(rawNormal);

    checkVertexBuffer[id.x] = vertex;
    checkNormalBuffer[id.x] = normal;
}
```

```csharp
checkVertexBuffer.GetData(checkVertex);

for (int i = 0; i < mesh.vertexCount; i++)
{
    if (mesh.vertices[i] != checkVertex[i])
    {
        Debug.LogError(i);
    }
}
```

---

全域物件效果 SDF 遮罩

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/8224038c-96aa-427b-80a7-22cedc010656/Untitled.png)

```csharp
fixed4 frag (v2f i) : SV_Target
{  
    float distance = (length(i.worldPos - _SDFCulling.xyz) - _SDFCulling.w) * _SDFCullingDir;

    clip(distance);

    return 1;
}
```

Depth Test Equal

![Untitled](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/8570724b-3cc7-4818-b9dd-b29f710bda59/Untitled.png)

## 結語

### 參考資料

[CREATE YOUR OWN RENDERER WITHOUT CODE in Unity!](https://youtu.be/szsWx9IQVDI)