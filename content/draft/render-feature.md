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

### 渲染物件 -

假設我想渲染一個物體

設置資源

```cs.CustomRenderPass
Mesh mesh;
Matrix4x4 transform;
Material material;

public void SetRenderObject(Mesh mesh, Vector3 position, Vector3 rotation, Vector3 scale, Material material)
{
    this.mesh = mesh;
    this.transform = Matrix4x4.TRS(position, Quaternion.Euler(rotation), scale);
    this.material = material;
}
```

添加渲染命令

```cs.CustomRenderPass
public override void Execute(ScriptableRenderContext context, ref RenderingData renderingData)
{
    CommandBuffer command = CommandBufferPool.Get("Command");

    if(mesh != null && material != null)
    {
        command.DrawMesh(mesh, transform, material, 0, 0);
    }

    context.ExecuteCommandBuffer(command);

    CommandBufferPool.Release(command);
}
```

回到 RenderFeature，建立要使用的屬性，傳入 

此時 Inspector 就會出現對應的參數 我們在 `Create()` 時加入

```cs.CustomRenderFeature
[SerializeField] Mesh mesh;
[SerializeField] Vector3 position;
[SerializeField] Vector3 rotation;
[SerializeField] Vector3 scale;
[SerializeField] Material material;

public override void Create()
{
    renderPass = new CustomRenderPass();

    renderPass.SetRenderObject(mesh, position, rotation, scale, material);
}
```

{{< resources/image "drawmesh-inspector.jpg" >}}

使用一個簡單的 Lambert Model 的 Unlit Shader，可以看到場景中出現一個物體 (沒看到的話可以確認一下 scale)，改變參數時也會引響到他

每當 Inspector 改變參數時 都會重新調用一次 Create

```hlsl
fixed4 frag (v2f i, uint id : SV_INSTANCEID) : SV_Target
{
    float3 lightDir = _WorldSpaceLightPos0.xyz;
    float light = dot(lightDir, i.normal);
    
    return fixed4(light.xxx, 1);
}
```

{{< resources/image "drawmesh.gif" >}}

<p><c>
註：我原本是使用 URP 的 Lit 材質，但他在 commandBuffer DrawMesh 中會變成黑色，不確定原因，可能是 URP 有一些工作不會再 Feature 進行，所以才建新的 Unlit 來用。
</c></p>

### 訪問資料 -

GraphicsSettings 與 QualitySettings 可以訪問到當前的渲染管線資料，但是 ScriptableRendererData 是封裝的，所以要靠反射? 取得，原理不清楚


```cs.FeatureAccess
RenderPipelineAsset pipelineAsset = GraphicsSettings.renderPipelineAsset;
//RenderPipelineAsset pipelineAsset = (RenderPipelineAsset)QualitySettings.renderPipeline;
```

取得之後就能得到 rendererFeatures，可以再透過名稱取得特定的資料

```cs.FeatureAccess
FieldInfo propertyInfo = pipelineAsset.GetType().GetField("m_RendererDataList", BindingFlags.Instance | BindingFlags.NonPublic);
ScriptableRendererData renderData = ((ScriptableRendererData[])propertyInfo?.GetValue(pipelineAsset))?[0];
```

或你嫌這樣太麻煩的話，也可以直接建立 Field 指定你的 RederData，效果相同

```cs.FeatureAccess
[SerializeField] ScriptableRendererData rendererData;
```

最後再透過 名稱取得指定的 Feature

```cs.FeatureAccess
List<ScriptableRendererFeature> features = renderData.rendererFeatures;
GPUInstenceFeature feature = features.Find(n => n.name == "CustomRenderFeature") as GPUInstenceFeature;
```

<!-- https://blog.csdn.net/boyZhenGui/article/details/125974779 -->

### 修改參數 -

能透過程式開關特定 Feature

```cs.FeatureAccess
feature.SetActive(true);
feature.SetActive(false);
```

{{< resources/image "modify-active.gif" >}}

或是修改 Feature 中的屬性，但需要建立對應的接口才行

```cs.FeatureAccess
feature.SetScale(scale);
```

```cs.CustomRenderFeature
public void SetScale(Vector3 scale)
{
    renderPass.SetRenderObject(mesh, position, rotation, scale, material);
}
```

{{< resources/image "modify-scale.gif" >}}

### 添加移除 -

能夠訪問到 RenderData 後，也能透過程式添加、移除指定的 Feature

RenderFeature 的是繼承了 ScriptableObject 所以可以透過 ScriptableObject.CreateInstance 建立

```csharp
ScriptableRendererFeature addFeature = ScriptableObject.CreateInstance<CustomRenderFeature>();
renderData.rendererFeatures.Add(addFeature);
```

不過要注意的是 renderData 也是資料夾中的 ScriptableObject，因此在編輯器中修改的內容會被保留，當退出遊玩模式後會發生 Missing 的問題，為了避免這種情況，最好是在離開時手動移除

{{< resources/image "add-feature-missing.jpg" >}}

```cs
renderData.rendererFeatures.Remove(addFeature);
```

當然，你也可以在運行時移除任何 Feature 只要透過名稱尋找即可

```cs
ScriptableRendererFeature removeFeature = renderData.rendererFeatures.Find(n => n.name == "AddedFeature");
renderData.rendererFeatures.Remove(removeFeature);
```

## 範例 -

最後，來提供一些範例

### 透視效果 -

首先是經典的範例，能用 URP 預設的 Feature 達成 請容許我直接放參考影片

因為真的沒必要再寫一次一樣的東西 :P

{{< youtube "szsWx9IQVDI" >}}

&nbsp;

### 全域遮罩 -

也是不用寫自訂 Feature 的效果

改變 Filtering 不要渲染受影響的物件

```hlsl
fixed4 frag (v2f i) : SV_Target
{  
    float distance = (length(i.worldPos - _SDFCulling.xyz) - _SDFCulling.w) * _SDFCullingDir;

    clip(distance);

    return 1;
}
```

建立 RenderObject Feature 

{{< resources/image "culling-setup.jpg" >}}

{{< resources/image "culling-feature-blank.jpg" >}}

{{< resources/image "culling-blank.gif" >}}

{{< resources/image "culling-feature-shaded.jpg" >}}

{{< resources/image "culling-shaded.gif" >}}

Sakura Rabbit 啟發

{{< resources/image "cullig-sakura-rabbit.gif" >}}

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