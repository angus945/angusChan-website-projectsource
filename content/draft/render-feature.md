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

<!-- &nbsp; -->

<!-- [text]({ ref "relpath" })。 -->

## SRP -

可腳本化的渲染管線 (Scriptable Render Pipeline) 是 Unity 提供開發者的一個渲染管線擴展方法，能讓我們更方便的從頭制定渲流程，物件、光照、陰影和後處裡效果等。

但從頭開發一次渲染管線會需要做許多繁瑣工作，而我們有時只是想給管線添加一些自訂功能，沒必要

所以 Unity 也提供了現成的管線模板 (URP, HDRP?)，以及對管線進行功能擴充的強大功能 - RenderFeature。

這篇筆記適合已經有 Shader 基礎，並且了解渲染管線的基礎知識，想開始接觸 SRP (URP) 的人。本文會省略基本的著色器內容，讓內容著重在 RenderFeature 的細節與運用上。

<!--more-->

### 環境設定 +

如果你要同時進行實做練習，請確保版本與環境一致，避免出現未知的錯誤。本文編寫時使用的版本為 Unity 2021.3.22f1，專案模板是 3D Core (3D 核心)。請 <r> 不要 </r> 用 URP 模板建立專案，一些進階的設定可能會導致學習時遇到過多干擾。

{{< resources/image "setup-create.jpg" >}}

取而代之，我們會在專案建立後透過 Packge Manager 導入 Universal Render Pipeline，並手動改變渲染管線設定。

{{< resources/image "setup-install.jpg" >}}

導入完成後，在資料夾中建立 URP Asset。Create > Rendering > URP Asset (with Universal Renderer)

{{< resources/image "setup-pipeline-asset.jpg" >}}

開啟專案設定圖形設定，將剛剛建立的管線資料放入 SRP Setting 中。Edit > Project Settings > Graphics > Scriptable Render Pipeline Settings。

{{< resources/image "setup-pipeline.jpg" >}}

## 基本資訊 +

在建立管線資料的同時，資料夾也出現了另一個有 _Renderer 後綴的物件，這是 SRP 的 Render Data 物件，我們會在裡面進行各種渲染設定，讓使用者客製化參數調整。URP 的 Render Data 中包括了基礎的渲染設定 Layer, Path, Shadow 等等。

在設定的最下面有個 RenderFeatures 就是今天的主角，點擊按鈕會出現一些選項，是 URP 中預設的擴充功能，一些簡單的效果不用編寫程式就達成。但我們先深入原理，晚點再來談效果與範例。

{{< resources/image "basis-render-data.jpg" >}}

管線的核心功能，可能包括渲染物件、光照、陰影等處理，而 Feature 則是附加在管線上的「擴展」功能，透過內部實做的 Pass 達成期望效果。管線可以有多個擴展，而每個擴展也可以有複數個實做內容。

<!-- {{< resources/image "basis-hierarchy.png" "40%" >}} -->

<!-- TODO 換更好的圖 -->

### 擴展管線 +

首先，擴展管線需要建立一個腳本，並繼承 `ScriptableRendererFeature`。當中有兩個函式需要實做 `Create()` 與 `AddRenderPasses()`。 `Create()` 會在遊戲初次載入時調用，用來給 Render Feature 初始化內容，而 `AddRenderPasses()` 會在每一幀調用，用來將實做內容註冊進管線當中。

```cs.CustomRenderFeature
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

回到編輯器中，現在 RenderData 已經可以添加我們自訂的擴展功能了。

{{< resources/image "basis-feature-add.jpg" "80%" >}}

### 擴展實做 +

實做擴展功能我們必須建立一個 Pass。

先不談優化與真實原理，在這裡，我們可以先把它想成是用於達成某些目的「一系列」渲染命令，我們會根據需求將一項項的命令註冊給渲染管線，讓它在時當的時機執行內容。

建立一個類別，繼承 `ScriptableRenderPass`，並實做 `Execute()` 函式與建構函式。

```cs.CustomRenderPass
using UnityEngine.Rendering;
using UnityEngine.Rendering.Universal;

class CustomRenderPass : ScriptableRenderPass
{
    public CustomRenderPass()
    {

    }
    public override void Execute(ScriptableRenderContext context, ref RenderingData renderingData)
    {

    }
}
```

`Execute` 函式是用來設定命令的地方，在 Unity 中我們會用 `CommandBufer` 保存 GPU 命令，並交由渲染管線執行內容。透過 `CommandBufferPool` 取得 Buffer 物件，將所需的功能添加完畢後，再用 `ExecuteCommandBuffer()` 執行命令，最後透過 `Release()` 釋放用完的緩衝區。

```cs.CustomRenderPass
public override void Execute(ScriptableRenderContext context, ref RenderingData renderingData)
{
    CommandBuffer command = CommandBufferPool.Get("Command");

    //command.DoSomeThing();

    context.ExecuteCommandBuffer(command);

    CommandBufferPool.Release(command);
}
```

這裡的 `ExecuteCommandBuffer` 並不是「馬上」執行命令，而是將命令排進管線的更底層中，等實際渲染的時候調用。回到 Feature，最後要在 `Create()` 中建立 Pass 物件，並透過 `AddRenderPasses()` 中將其註冊進管線中。

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

如此一來，一個沒有任何效果的擴展功能就完成了。

### 渲染物件 +

假設我想渲染一個物體，可以透過 `DrawMesh()` 命令達成，使用 `CommandBuffer.DrawMesh()` 將命令排進緩衝區。

```cs.CustomRenderPass
Mesh mesh;
Matrix4x4 transform;
Material material;

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

但命令是在 Pass 中執行的，記得提供接口傳遞渲染需要的資訊，模型、矩陣與材質等等。

```cs.CustomRenderPass
public void SetRenderObject(Mesh mesh, Vector3 position, Vector3 rotation, Vector3 scale, Material material)
{
    this.mesh = mesh;
    this.transform = Matrix4x4.TRS(position, Quaternion.Euler(rotation), scale);
    this.material = material;
}
```

回到 RenderFeature，建立要使用的屬性欄位後，Inspector 就會出現對應的參數讓我們調整，只要在 `Create()` 函式傳入 Pass 就能讓渲染產生效果了。

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

建立一個簡單的 Unlit Shader 進行測試，使用 Lambert 進行光照計算。設置完各種參數後，應該能看到場景中出現一個物體（沒看到的話可以確認一下 Scale），而任何參數的變動都會即時產生影響，因為在 Inspector 中改變參數的同時，`Create()` 都會被重新調用。

```hlsl
fixed4 frag (v2f i, uint id : SV_INSTANCEID) : SV_Target
{
    float3 lightDir = _WorldSpaceLightPos0.xyz;
    float light = dot(lightDir, i.normal);
    
    return fixed4(light.xxx, 1);
}
```

{{< resources/image "drawmesh.gif" >}}

<!-- TODO assets -->

<p><c>
註：我原本是使用 URP 的 Lit 材質，但他在 CommandBuffer DrawMesh 中會變成黑色，不確定原因。
</c></p>

### 訪問資料 +

除了從 Inspector 進行初始設定以外，我們也能透過程式修改參數。GraphicsSettings 與 QualitySettings 可以訪問到當前的管線資料。

```cs.FeatureAccess
RenderPipelineAsset pipelineAsset = GraphicsSettings.renderPipelineAsset;
//RenderPipelineAsset pipelineAsset = (RenderPipelineAsset)QualitySettings.renderPipeline;
```

但 `ScriptableRendererData` 是被封裝的，所以要靠反射 (Reflection) 取得，原理我還不清楚，總之有效 :P

```cs.FeatureAccess
FieldInfo propertyInfo = pipelineAsset.GetType().GetField("m_RendererDataList", BindingFlags.Instance | BindingFlags.NonPublic);
ScriptableRendererData renderData = ((ScriptableRendererData[])propertyInfo?.GetValue(pipelineAsset))?[0];
```

如果你嫌這樣麻煩的話，也可以直接用變數指定 RederData，效果相同。

```cs.FeatureAccess
[SerializeField] ScriptableRendererData rendererData;
```

最後，我們就能取得 RederData 中的所有 Feature，如果要尋找特定內容的話，可以透過名稱進行篩選。

```cs.FeatureAccess
List<ScriptableRendererFeature> features = renderData.rendererFeatures;
GPUInstenceFeature feature = features.Find(n => n.name == "CustomRenderFeature") as GPUInstenceFeature;
```

至於名稱就是我們在添加擴展時，於第一個 Name 欄位填寫的內容。

{{< resources/image "feature-access-name.jpg" >}}

<!-- https://blog.csdn.net/boyZhenGui/article/details/125974779 -->

### 修改內容 +

**開關功能**

在成功訪問 Feature 的資料後，我們也能對它的參數進行修改。首先是開關效果，只要調用 `SetActive()` 即可達成。

```cs.FeatureAccess
feature.SetActive(true);
feature.SetActive(false);
```

**修改參數**

{{< resources/image "modify-active.gif" >}}

我們也可以 Feature 中的自訂參數，但需要建立對應的接口才行。

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

**添加移除**

最後，我們也能透過程式添加、移除指定的 Feature。所以可以透過 ScriptableObject 的 `CreateInstance<T>()` 建立我們想要的類別，再將它加入 renderData 的列表中。

```csharp
ScriptableRendererFeature addFeature = ScriptableObject.CreateInstance<CustomRenderFeature>();
renderData.rendererFeatures.Add(addFeature);
```

不過要注意的是， RenderData 也是資料夾中的 ScriptableObject，因此在編輯器中修改的內容會被保留，當退出遊玩模式後會發生 Missing 的問題。為了避免這種情況，最好是在離開時手動移除

{{< resources/image "add-feature-missing.jpg" >}}

```cs
renderData.rendererFeatures.Remove(addFeature);
```

## 實作範例 +

最後來提供一些範例，讓我們對這項強大的功能有更進一步的理解。

### 全域遮罩 +

距離場 (Signed Distance Field) 是著色器中經常使用的技巧，無論遮罩剔除或或經典的溶解效果都是常見的應用。但我之前就在想，難道距離場一定要寫在每個腳本中嗎？有沒有更泛用的全域解方？之前一直想不到，直到我接觸 Render Feature 後才研究出理想的實現方法。

這是不用寫自訂 Feature 的效果，只要用 URP 的預設功能幾可。首先要先給受影響的物件設置 Layer，並在 Filtering 中將圖層移除，確保物體不會被預設的方法渲染。

{{< resources/image "culling-setup.jpg" >}}

建立一個 Unlit Shader ，我們會在當中透過球體距離場進行像素剔除，至於原理這裡就不多做贅述，基本的 SDF 應用而已。接著用 Shader 建立一顆材質球。

```hlsl
uniform float _SDFCullingDir;
uniform float4 _SDFCulling;

fixed4 frag (v2f i) : SV_Target
{  
    float distance = (length(i.worldPos - _SDFCulling.xyz) - _SDFCulling.w) * _SDFCullingDir;

    clip(distance);

    return 1;
}
```

回到 RenderData 物件，在最下方添加 Render Objects Feature，並且將 Filters 的渲染圖層設置為要渲染的物件圖層。不過它特別的地方是你可以用一些選項來覆寫原本的設定，例如材質與深度設定。所以我們要將材質換成自己的，並設定一般的深度寫入功能。

{{< resources/image "culling-feature-blank.jpg" >}}

設定完成後，只要在場景中將剔除資訊傳入 Shader，就能產生全域的距離場效果了。

```cs
[SerializeField] Transform cullingSphere;
[SerializeField] bool cullIn;

void Update()
{
    Vector4 cullingSDF = cullingSphere.position;
    cullingSDF.w = cullingSphere.localScale.x / 2;

    Shader.SetGlobalVector("_SDFCulling", cullingSDF);
    Shader.SetGlobalFloat("_SDFCullingDir", cullIn ? 1 : -1);
}
```

{{< resources/image "culling-blank.gif" >}}

但這樣還是讓所有物件都用相同材質渲染不是嗎？別急，接下來才是魔法發生的地方，我們可以讓物體再用他的材質渲染一次。建立另一個 Render Objects 的效果，但這次不覆寫材質球與深度寫入，只進行深度測試而已，將測試改為 Equal 就能達成全域的 SDF 效果了。

{{< resources/image "culling-feature-shaded.jpg" >}}

還記得第一次渲染時寫入的深度資料嗎？這個效果的原理是透過一次的 SDF 渲染，在 Depth Buffer 中建立深度「遮罩」，再用第二次的渲染將物件畫在遮罩覆蓋的範圍中。

{{< resources/image "culling-shaded.gif" >}}

效能可能沒那麼理想？畢竟渲染了兩次物體，但至少，這是我覺得比較好維護的作法了。至於特效部份可以用後處裡達成，這裡就先跳過了。這是受 Sakura Rabbit 啟發的研究，他真的相當厲害 XD

{{< resources/image "cullig-sakura-rabbit.gif" >}}

### 畫面處理 +

無論要叫它後處理還是畫面效果都一樣，這是一種對渲染完畢的結果進行二次處理的特效手段，用來給畫面添加如景深、模糊、光暈等特效的方法。與 Built-in 管線不同的是，URP 不能在 `OnRenderImage()` 中編寫效果，不太方便，但相對的是更良好的維護與擴展性。

先來看看原本的 `OnRenderImage()` 函式。這裡有兩個輸入 `source` 與 `destination`，一個為原始圖片的來源，而另一個則是處理完的圖片去向，我們會透過 `Blit()` 進行畫面處理，使用材質球的中的 fragment shader 對圖片的每個像素進行修改。 

```cs
Material material;
void OnRenderImage(RenderTexture source, RenderTexture destination)
{
    Graphics.Blit(source, destination, material);
}
```

這裡需要兩個 `RenderTexture` 的原因是，`Blit()` 不能指定與來源相通的目標作為複製對象，所以要先用一個臨時的 RT 暫存，等處理完畢再複製回 FrameBuffer，而 `RenderImage()` 幫我們完成了這項工作。

<!-- https://docs.unity3d.com/ScriptReference/MonoBehaviour.OnRenderImage.html -->

在 URP 的 RenderPass 中，上述工作需要靠自己達成。建立一個 `RenderTargetIdentifier` 與 `RenderTargetHandle` 的變數，作為圖片來源以及暫存的圖片位置。為了使用自訂的材質處理，還要在建構函式提供對應的變數輸入。

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

**RenderTargetIdentifier**

這是儲存 RenderTexture 的指標。在各種管線擴展中，想取的畫面渲染的目標都會使用，可以用它儲存 FrameBuffer 或任何 RenderTexture 的位置。

**RenderTargetHandle**

這是著色器變數的 ID。為了效能，所有的 Shader 參數都是透過 ID 儲存的，這可以避免使用名稱（字串）訪問時的 Hash 開銷。

在這裡可以把他當成封裝 `RenderTargetIdentifier` 的類別，你可以先透過 `Init()` 函式指定名稱，直到需要臨時 RenderTexture 時，它會用這個名稱幫你建立一個。

**RenderTextureDescriptor**

這是包裝了建立 RenderTexture 所需資訊的類別，同樣是為了更高的效能，可以拿它建立我們需要的 RenderTexture。

<!-- https://blog.csdn.net/mango9126/article/details/126418331 -->

<!-- https://zhuanlan.zhihu.com/p/115080701 -->

<!-- https://docs.unity3d.com/ScriptReference/Rendering.CommandBuffer.GetTemporaryRT.html -->

根據先前對 `OnRenderImage()` 與 `Blit()` 的解釋，首先我們要建立一個臨時的 RenderTexture 作為 `Blit()` 複製的對象。透過 `cameraTargetDescriptor` 訪問渲染目標的格式並保存，我們可以修改 `depthBufferBits` 來控制暫存圖片是否使用深度與模板緩衝區。

<!-- https://docs.unity3d.com/ScriptReference/RenderTextureDescriptor.html -->
<!-- https://docs.unity3d.com/ScriptReference/Rendering.CommandBuffer.GetTemporaryRT.html -->

```cs.ImageEffectPass
public override void Execute(ScriptableRenderContext context, ref RenderingData renderingData)
{
    //...
    
    RenderTextureDescriptor cameraTargetDescriptor = renderingData.cameraData.cameraTargetDescriptor;
    cameraTargetDescriptor.depthBufferBits = 0;

    //...
}
```

透過 `GetTemporaryRT()` 命令取得 `RenderTexture`，它會根據我們傳入的 ID 與圖片格式，在全域建立一個臨時的 RenderTexture。

```cs.ImageEffectPass
public override void Execute(ScriptableRenderContext context, ref RenderingData renderingData)
{
    //...cameraTargetDescriptor.depthBufferBits = 0;
    
    command.GetTemporaryRT(tempTexture.id, cameraTargetDescriptor, FilterMode.Bilinear);

    //...
}
```

處裡完前置作業後，剩下的就和 `OnRenderImage()` 沒什麼差別了。透過 `Blit()` 將影像來源複製到臨時的 RenderTexture 裡，並經過 Fragment Shader 完成後處裡效果，再用另一個 Blit 複製回 frame buffer。

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

在完成畫面處裡後，還要把臨時的 RenderTexture 釋放。Render Pass 有提供 `FrameCleanup()` 函式可以讓我們編寫釋放工作。

```cs.ImageEffectPass
public override void FrameCleanup(CommandBuffer cmd)
{
    cmd.ReleaseTemporaryRT(tempTexture.id);
}
```

最後，我們還需要一個函式來指定要處理的圖片來源。 

```cs.ImageEffectPass
public void SetSource(RenderTargetIdentifier source)
{
    this.sourceTexture = source;
}
```

完成 RenderPass 的作業後，就是回到 Feature 中完成後續設置。把 Material 與渲染目標傳入，並將 pass 添加進渲染管線中。

```cs.ImageEffectFeature
[SerializeField] string shaderName;

ImageEffectPass pass;

public override void Create()
{
    Material material = new Material(Shader.Find(shaderName));
    pass = new ImageEffectPass(material);
}
public override void AddRenderPasses(ScriptableRenderer renderer, ref RenderingData renderingData)
{
    pass.SetSource(renderer.cameraColorTarget);

    renderer.EnqueuePass(pass);
}
```

最後的最後，回到 Editor 裡建立預設的 ImageEffectShader （負片效果），並在 RenderData 中加入我們的 Feature，設置完畢就能在 GameView 看到效果了！

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