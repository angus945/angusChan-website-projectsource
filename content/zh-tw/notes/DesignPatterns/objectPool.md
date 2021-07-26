---
title: "設計模式筆記 ObjectPool"
date: 2021-07-26T15:48:40+08:00
lastmod: 2021-07-26T15:48:40+08:00
draft: false
keywords: []
description: ""
tags: []
category: ""
author: "angus chan"
featured_image: ""
listable: true
important: 10

# You can also close(false) or open(true) something for this content.
# P.S. comment can only be closed
order: 0
comment: true
likecoin: false
toc: true
autoCollapseToc: false
postMetaInFooter: false
hiddenFromHomePage: false
# You can also define another contentCopyright. e.g. contentCopyright: "This is another copyright."
contentCopyright: false
reward: false
mathjax: false
mathjaxEnableSingleDollar: false
mathjaxEnableAutoNumber: false

# You unlisted posts you might want not want the header or footer to show
hideHeaderAndFooter: false

# You can enable or disable out-of-date content warning for individual post.
# Comment this out to use the global config.
#enableOutdatedInfoWarning: false

flowchartDiagrams:
  enable: false
  options: ""

sequenceDiagrams: 
  enable: false
  options: ""

---

避免單獨的分配和釋放記憶體空間，在固定的池中重用物件以提高效能和記憶體使用率。

## 使用動機

我們在處理遊戲的視覺效果，當法師施放法術時畫面上將爆發炫麗的特效，這需要調用粒子系統來實例化一個粒子物件來產生閃爍的圖案，並且顯示動畫直到消失。

### 記憶體分配

在物件實例化時系統會分配一塊記憶體空間給物件儲存所需的資料，而當物件不再需要，要將他銷毀時，有垃圾回收機制 GC (Garbage Collection) 的語言也會自動的將原本使用的記憶體空間釋放。

但是上面兩項工作都是有效能開銷的，尤其是在彈幕這類需要使用大量物件的遊戲中，頻繁的實例化和銷毀物件會直接拖垮效能。

### 記憶體碎片化

除了開銷以外，記憶體碎片化也是重複分配和釋放記憶體會產生的問題，尤其在記憶體使用緊張的環境下，如移動設備，記憶體碎片化可能會對效能產生致命的引響。

碎片化的意思是淺堆中的剩餘空間被打碎成難以使用的小碎片，而不是較大的連續記憶體位置，哪怕碎片化發生的不頻繁，他也會逐漸把淺堆變成坑坑洞洞的，最終導致遊戲崩潰。

{{< pathImage "memoryFragmentation.jpg" >}}

一個簡單有效的方法是在遊戲開始時先取一大塊記憶體，重複使用直到遊戲結束再釋放，雖然這導致要在運行時創建和銷毀物件變得麻煩，但比起其他優化方法，這算沒什麼明顯缺點的模式了。

## Object Pool

### 使用時機

這個模式廣泛的使用在各種事物上，無論是可見的粒子特效或像音效不那麼視覺化的數據結構。

物件池可以在以下情況中使用

- **需要頻繁創建和銷毀物件**
- **物件佔據的空間相差不大**
- **分配物件記憶體十分緩慢或會導致記憶體碎片**
- **物件中封裝了像是資料庫和網路連接這種昂貴但可以重用的資源**

### 請記住

當你拋棄語言中的各種自動管理記憶體的機制，就意味著管理記憶體使用的責任落到自己的身上。

**_物件池可能在不需要的物件上浪費記憶體_**

物件池的大小需要根據遊戲需求設置，當池子太小可能導致物件數量不夠用，但更大的物件池也意味著可能浪費多餘的記憶體。

**_同時只能啟用固定數量的物件_**

如果池中所有的物件都正在使用時，新的物件請求可能會無效。

這在某種程度上是件好事，因為你能夠保證每種類型的物件都佔據固定的記憶體空間，不會發生某些東西佔據大量記憶體導致干擾了遊戲中其他的關鍵事件。

- **_完全阻止_**  
    簡單來說就是讓池子大到不會發生物件不足的情況，這樣一來無論玩家在做什麼都不用擔心物件不足的情況。缺點就是得為了少數極端情況將物件池加大，白白浪費了多的記憶題空間。

    通常在遊戲中的重要物件，如敵人和道具會適合這麼做，也可以評估有沒有特定場景中會使用到大量物件，如音效，再為場景獨立調整使用的物件池大小。

- **_停止創建物件_**  
    雖然聽起來很糟糕，但是對於粒子這種沒有必要在同時間使用內超大量使用的物件很適合，畢竟當物件池被用乾的時候代表整個畫面都是閃爍的特效，這時玩家也不容易注意到某個煙霧或閃光沒有出現。

- **_強制回收一個物件_**  
    和上一個選項相反，這次是強制回收某個物件，適合使用在音效系統上，因為當某個應該要撥放的音效沒有出現，在遊玩上感受到相當的違和感。

    但如果某個戲劇性的音效被中斷同樣也會造成不適感，所以更好的方法是尋找適合回收的物件，也就是最小聲的那個音效進行回收，並用新的聲音將他覆蓋掉。

- **_擴大物件池_**  
    如果遊戲允許記憶體使用上有某種程度的彈性，那麼在運行時增加池子的大小也是可行的，只是使用這種方式也要考慮增加的物件不再需要時，是否要銷毀他好將池子恢復原來的大小。

**_每個物件佔的記憶體大小固定_**

通常物件池都是將物件儲存在一個陣列中，如果所有的物件都是相同類型，那麼使用的記憶體位置會被排放在一起。

所以當物件的大小是會變化的，這就會浪費掉相當大的記憶體空間，因為你需要讓陣列的每個位置都是用最大容量來保證不會發生空間不足的狀況。

這就像是你使用一堆特大號的箱子存放東西，但只有其中幾個箱子裡面裝入的物體真的佔據這麼大空間，而其他每個也只放了像鑰匙圈這種小玩意兒。

如果發現自己如上說的浪費了一堆空間，可以考慮根據物件的大小將它們使用獨立的池子來儲存。

**_重用的物件不會自行初始化_**

通常語言中自帶的記憶體管理系統會在新物件實例化時也將數據初始化，但使用物件時也代表我們失去這項工具了，這代表你必須確保每次回收或請求收物件將他的數據進行初始化工作。

**_物件引用仍會保留_**

如果場景中其他地方仍有對物件池物件的引用，那麼當物件被回收時這個引用很有可能仍保留著，所以當一個物件被回收時，清除其他物件對他的引用也是必需的。

## 範例

### 基本展示

以最簡單的功能展示範例，首先是粒子自身的類別。他擁有一個會進行初始化工作的啟用函式，以及會更新自身位置和時間的更新函式和根據當前持續時間回傳使用狀態的屬性變數。

```csharp
class Particle
{
    public bool isUsing
    {
        get
        {
            //check particle lifetime
        }
    }

    public void Enable(Vector2 position, Vector2 velocity, float duration)
    {
        //initial position, velocity and set lifetime
    }
    public void Update()
    {
        //update position and lifetime
    }
}
```

再來是粒子物件池，使用陣列儲存粒子物件，並為所有粒子調用更新函式，當有新的粒子請求時會將陣列遍歷一次，並找出閒置的粒子進行播放。

```csharp
class ParticlePool
{
    Particle[] particles;

    public void EnableParticle(Vector2 position, Vector2 velocity, float duration)
    {
        for (int i = 0; i < particles.Length; i++)
        {
            if (!particles[i].isUsing)
            {
                particles[i].Enable(position, velocity, duration);
                return;
            }
        }
    }
    public void Update()
    {
        for (int i = 0; i < particles.Length; i++)
        {
            particles[i].Update();
        }
    }
}
```

物件池的概念相當簡單，一個基本粒子物件池作法就像上面這樣而已。

### 自由表

上面的程式碼能夠很明顯的看出問題，每次請求時花費的時間最糟的可能是 O(n)，所以將陣列遍歷一次來找閒置粒子實在太慢了。

為了避免這點，最好的方法就是持續追蹤所有粒子的狀態，我們可以透過另一個陣列儲存閒置粒子的索引值，透過陣列中的第一個索引取得閒置粒子並將索引移除，反之回收粒子時則將索引加回陣列。

{{< text/greenLine >}}
註 : 參考資料中使用的是指標陣列，儲存指向閒置粒子的位置
{{</ text/greenLine >}}

這種作法得要管理一個和物件池大小相同的單獨陣列，當所有粒子都未使用時會額外消耗大量的記憶空間，但其實我們可以透過使用粒子自身的記憶體空間來達到目的。

當粒子沒有使用時，其中的位置和速度等變數仍會佔據空間，我們要透過聯合 union 來使用這些暫時用不到的記憶體位置。

建立一個變數用於儲存下個閒置粒子的引用，並使用 C# 的 `[FieldOffset]` 前綴讓引用和啟用粒子時所需的變數共用記憶體空間。

```csharp
[StructLayout(LayoutKind.Explicit)]
class Particle
{
    struct LiveData
    {
        Vector2 position;
        Vector2 velocity;
    }

    [FieldOffset(0)]
    LiveData liveData;

    [FieldOffset(0)]
    Particle _next;
    public Particle next { get => _next; set => _next = value; }
}
```

{{< text/greenLine >}}
註 : C# 中沒有 C 語言的 union，我不確定這樣有沒有效，但應該是很接近正確的做法了
{{</ text/greenLine >}}

可以用這些指向下一個粒子的引用構建出一個連接鏈表，將所有閒置中的粒子連在一起，而且不需要消耗額外記憶體，這種作法被稱作 - [freelist](https://en.wikipedia.org/wiki/Free_list)

為了讓他工作我們需要確保物件正確初始化，當物件池被初始化時所有粒子都是閒置的，所以我們可以直接將粒子的 next 設為陣列中的下一個元素，並保存第一個粒子的引用為第一可用粒子。

```csharp
class ParticlePool
{
    Particle firstAvailable;

    void InitParticlePool()
    {
        firstAvailable = particles[0];
        for (int i = 0; i < particles.Length - 1; i++)
        {
            particles[i].next = particles[i + 1];
        }
    }
}
```

而要啟用新的粒子時，直接尋找可用粒子啟用，並將其中的下一個粒子的引用設置成第一可用粒子。

```csharp
public void EnableParticle(Vector2 position, Vector2 velocity, float duration)
{
    if (firstAvailable == null) return;

    Particle enable = firstAvailable;
    firstAvailable = enable.next;

    enable.Enable(position, velocity, duration);
}
```

為了知道粒子什麼時候死亡，我們必須在粒子的刷新函式回傳自身狀態。

```csharp
class Particle
{
    public bool Update()
    {
        //update position and lifetime...
        return lifetime > 0;
    }
}
```

在物件池遍歷並調用刷新時進行判斷，當有粒子死亡時就將他儲存為第一可用粒子，並將原本的那個存入新粒子的 next 保持鏈表的連接。

```csharp
if (!particles[i].Update())
{
    particles[i].next = firstAvailable;
    firstAvailable = particles[i];
}
```

這樣一來就完成了一個更進階的物件池，他只需要常數時間雜度就能達成啟用和回收物件，並且不需要消耗額外的記憶體空間。

## 設計決策

物件池的實現方法相當單純，創造物件用陣列儲存，並在需要使用物件的時候進行初始化。不過現實的狀況很少會這麼簡單，所以這裡還有些設計決策可以幫助我們思考。

### 物件與池是否耦合

編寫物件池時第一個需要思考的問題就是，池子是否知道被儲存物件的詳細類別，以及物件需不需要知道自己是物件池中的一分子。

**_如果與物件池耦合_**

- **實現簡單**  
    物件中只需要添加"使用中"的標籤變數就完成了，物件池要啟用物件時可以直接檢查物件裡的狀態標籤，而且初始化工作和一些事件監聽也能直接透過物件池執行。

- **保證物件只能由物件池創建**  
    最簡單的方法是將物件的建構函式設為 protected internal，且將物件與物件池兩者封裝進同一個命名空間，就能夠保證粒子只能由粒子物件池創建。

    ```csharp
    namespace ParticleSystem
    {
        class Particle
        {
          protected internal Particle() { }
        }
        class ParticlePool { } 
    }
    ```

    {{< text/greenLine >}}
    註 : 參考書中使用的是 C++ 中的友類別 friend class 進行封裝，所以才會需要與物件池耦合，但 C# 中好像沒有這種功能，所以使用相似的 protected internal 封裝進命名空間
    {{</ text/greenLine >}}

**_如果不與物件池耦合_**

- **可以保存多種類型的物件**  
  這是最大的好處，透過解耦物件與物件池就能夠實現通用的物件池類別，因為池子不再需要知道儲存物件的實際類別了。

  ```csharp
  class ObjectPool<T>
  {
      T[] poolObjects;
  }
  ```

- **必須在物件的外部追蹤物件的使用狀態**  
  因為當池子不再知道物件的實際類別是什麼時，也代表他不能取的物件的內部狀態，所以需要另外用一個陣列儲存使用狀態的標籤。

  ```csharp
  class ObjectPool<T>
  {
      T[] poolObjects;
      bool[] isUsing;
  }
  ```

  {{< text/greenLine >}}
  註 : 在 C# 中可以透過介面泛型來達到使用內部狀態的功能，並且保持封裝
  {{</ text/greenLine >}}

  ```csharp
  class ObjectPool<T> where T : IPoolObject
  {

  }
  interface IPoolObject
  {
      bool isUsing { get; }
  }
  ```

### 誰來初始化重用物件

在前面的部分有提到過，為了重用我們的物件就必須要手動為它們執行初始化工作，但是由誰來執行也是一個思考點了。

**_透過物件池內部_**

- **物件池可以完全將物件封裝**  
    如果沒有額外的需求，初始化應該是重用物件唯一需要由外部調用執行的工作，如果將這項工作交由物件池執行，也代表物件被完全封裝進物件池系統中了。並且完全封裝後也代表不用擔心外部程式有對重用物件的引用了。

- **物件的功能會與初始化方法綁定**  
    如果初始化是由物件池執行的，那麼調用粒子的對外接口必須要支援所有允許的操作，並將初始參數傳遞給粒子。

    ```csharp
    class ParticlePool
    {
        public void EnableParticle(Vector2 position, float duration);
        public void EnableParticle(Vector2 position, Vector2 velocity, float duration);
        public void EnableParticle(Vector2 position, float angle, float duration);
    }
    ```

**_透過外部程式執行_**

- **物件池的接口更簡單**  
    由外部執行初始化的話，物件池只需要簡單的回傳物件即可。

    ```csharp
    class ParticlePool
    {
        public Particle EnableParticle();
    }
    ```

    至於初始化的部分外部程式直接調用物件中的函式執行就好。

    ```csharp
    Particle particle = particlePool.EnableParticle();
    particle.Initial(Vector3.one, 5);
    ```

- **外部程式需要處理請求失敗情況**  
    如果在物件池被用乾的時候，接口可能會回傳 null 值，所以外部必須要自己處理這種狀況。

    ```csharp
    if(particle != null)
    {
        particle.Initial(Vector3.one, 5);
    }
    ```

## 參考資料

[Object Pool (原文)](http://gameprogrammingpatterns.com/object-pool.html)

[Object Pool (翻譯)](http://gpps.billy-chan.com/object-pool.html)

### 補充資料

[Free list](https://en.wikipedia.org/wiki/Free_list)
