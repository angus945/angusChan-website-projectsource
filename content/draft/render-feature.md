---
title: "【筆記】用 Render Feature 擴展 URP 管線"
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

URP 中提供的

比較好接觸的實用功能 RenderFeature

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

## 實作範例 -

最後，來提供一些範例

### 全域遮罩 -

也是不用寫自訂 Feature 的效果

{{< resources/image "culling-setup.jpg" >}}

建立一個 SDF Shader

```hlsl
fixed4 frag (v2f i) : SV_Target
{  
    float distance = (length(i.worldPos - _SDFCulling.xyz) - _SDFCulling.w) * _SDFCullingDir;

    clip(distance);

    return 1;
}
```

建立 RenderObject Feature 用覆寫材質渲染 就能渲染出受到 SDF 的物件了 要讓他寫入深度

{{< resources/image "culling-feature-blank.jpg" >}}

{{< resources/image "culling-blank.gif" >}}

在渲染一次物體，但這次用物件自己的材質 但是改變 Depth Test 使用 Equal 將 SDF 作為遮罩

{{< resources/image "culling-feature-shaded.jpg" >}}

{{< resources/image "culling-shaded.gif" >}}

這是受 Sakura Rabbit 啟發的 邊緣的發光可以用後處理達成

{{< resources/image "cullig-sakura-rabbit.gif" >}}

### 畫面處理 -

畫面後處理 對渲染完畢的結果進行處理 達成更多效果 PostProcessing, ImageEffect

URP 與 Built in 不同，不能在 OnRenderImage 寫後處理 沒那麼方便，但相對有更高的維護性與擴展性

<!-- 後處理使用的材質球 -->

在原本的 OnRenderImage 函式，有兩個輸入 source 與 destination，一個為原始圖片的來源 另一個是處理後圖片的位置，我們會透過 Blit 進行畫面處理，使用材質球的 fragment shader 

會需要兩個 RT 是因為 Blit 不能指定與來源相通的目標 所以要先用一個臨時的 RT 暫存，等處理完畢再複製回 FrameBuffer

```cs
Material material;
void OnRenderImage(RenderTexture source, RenderTexture destination)
{
    Graphics.Blit(source, destination, material);
}
```

而在 URP 的自訂 RenderPass 中，需要靠自己處裡上面幾項工作 

透過 `RenderTargetIdentifier` 儲存圖片來源 FrameBuffer，`RenderTargetHandle` 處存臨時 RT，透過建構函式傳入要使用的材質球

```cs.ImageEffectPass
Material material;
RenderTargetIdentifier sourceTexture;
RenderTargetHandle tempTexture;

public ImageEffectPass(Material material)
{
    this.material = material;
    tempTexture.Init("_TempTexture");

    renderPassEvent = RenderPassEvent.AfterRenderingPostProcessing;
}
```

`RenderTargetIdentifier` 儲存 RT 的指標 各種擴展管線 取的儲存渲染目標都會使用 可以用它來取得 處存 FrameBuffer 的位置

`RenderTargetHandle` 著色器變數的指標，也可以儲存 RT ，但需要先被定義?  

Shader 的 Properity 是透過 index 處存的 ShaderID Shader.PropertyToID

<!-- https://zhuanlan.zhihu.com/p/115080701 -->

<!-- https://docs.unity3d.com/ScriptReference/Rendering.CommandBuffer.GetTemporaryRT.html -->

需要一個函式來指定 圖片的來源 

```cs.ImageEffectPass
public void SetSource(RenderTargetIdentifier source)
{
    this.sourceTexture = source;
}
```

透過 RenderTextureDescriptor 取得渲染目標的 RT ，RenderTextureDescriptor 包括建立 RT 需要的所有變數，我們可以透過 GetTemporaryRT 建立一個 RT 根據 ShaderPropID 建立一個 RT 並存在全域，而 depthBufferBits 則是設定是否啟用 Depth, Stencil Buffer

> This creates a temporary render texture with given parameters, and sets it up as a global shader property with nameID

<!-- https://docs.unity3d.com/ScriptReference/RenderTextureDescriptor.html -->

<!-- https://docs.unity3d.com/ScriptReference/Rendering.CommandBuffer.GetTemporaryRT.html -->

```cs.ImageEffectPass
public override void Execute(ScriptableRenderContext context, ref RenderingData renderingData)
{
    //...
    
    RenderTextureDescriptor cameraTargetDescriptor = renderingData.cameraData.cameraTargetDescriptor;
    cameraTargetDescriptor.depthBufferBits = 0;
    command.GetTemporaryRT(tempTexture.id, cameraTargetDescriptor, FilterMode.Bilinear);

    //...
}
```

最後就是後處裡發揮效果的部分了 先透過一個 blit 將來源複製到臨時 RT，並經過 Material 的 Shader 效果

處理完之後再用另一個 Blit 複製回 frame buffer

```cs.ImageEffectPass
public override void Execute(ScriptableRenderContext context, ref RenderingData renderingData)
{
    //...command.GetTemporaryRT

    command.Blit(sourceTexture, tempTexture.Identifier(), material, 0);
    command.Blit(tempTexture.Identifier(), sourceTexture);
    
    //...
}
```

<!-- https://docs.unity3d.com/ScriptReference/Rendering.ScriptableRenderContext.ExecuteCommandBuffer.html -->

最後要把用完的 RT 釋放，SRP Render Pass 有一個函式 `FrameCleanup` 會傳入清除的 Command，我們可以添加 ReleaseTemporaryRT 進去

```cs.ImageEffectPass
public override void FrameCleanup(CommandBuffer cmd)
{
    cmd.ReleaseTemporaryRT(tempTexture.id);
}
```

回到 Feature 設置，在 Create 函式裡建立 mass 並傳入畫面處理的 pass

```cs.ImageEffectFeature
[SerializeField] string shaderName;

ImageEffectPass pass;

public override void Create()
{
    Material material = new Material(Shader.Find(shaderName));
    pass = new ImageEffectPass(material);
}
```

最後在 AddRenderPasses 中設置 renderTarget，並將 pass 添加進渲染管線

```cs
public override void AddRenderPasses(ScriptableRenderer renderer, ref RenderingData renderingData)
{
    pass.SetSource(renderer.cameraColorTarget);

    renderer.EnqueuePass(pass);
}
```

回到 Editor 建立一個預設的 ImageEffectShader (負片效果) ，並 RenderData 加入我們的 Feature，就能在 game view 看到效果了

{{< resources/image "image-effect.jpg" >}}

<!-- https://youtu.be/MLl4yzaYMBY -->

### 批量繪製 -

也可以把 GPU instance 轉移到 Render Feature 中 基本上作法和一般的沒兩樣 只是 Graphics 命令改成用 CommandBuffer

跳過基本的計算著色器內容，不了解計算著色器的讀者可以先參考 [【筆記】初學指南，計算著色器]({{< ref "/learn/compute-shader/compute-shader-basis" >}})

這裡就只展示編寫的差異 不從頭開始了

```cs.GPUInstancePass
public override void Execute(ScriptableRenderContext context, ref RenderingData renderingData)
{
    CommandBuffer command = CommandBufferPool.Get("Command");

    command.SetBufferCounterValue(resultBuffer, 0);
    //resultBuffer.SetCounterValue(0);

    command.DispatchCompute(compute, kernel, (instanceCount / 640 + 1), 1, 1);
    //compute.Dispatch(kernel, (instanceCount / 640 + 1), 1, 1);

    command.CopyCounterValue(resultBuffer, argsBuffer, sizeof(uint));
    //ComputeBuffer.CopyCount(resultBuffer, argsBuffer, sizeof(uint));

    command.DrawMeshInstancedIndirect(instanceMesh, 0, material, 0, argsBuffer);
    //Graphics.DrawMeshInstancedIndirect(instanceMesh, 0, material, new Bounds(Vector3.zero, new Vector3(100.0f, 100.0f, 100.0f)), argsBuffer);

    context.ExecuteCommandBuffer(command);

    CommandBufferPool.Release(command);
}
```

繪製草地植被等等 可能會會更好維護

{{< resources/image "gpu-instance.jpg" >}}

## 結語

(基本上所有 Graphics 與 ComptueShader 命令都有可以)

### 參考資料

[CREATE YOUR OWN RENDERER WITHOUT CODE in Unity!](https://youtu.be/szsWx9IQVDI)

{{< youtube "szsWx9IQVDI" >}}