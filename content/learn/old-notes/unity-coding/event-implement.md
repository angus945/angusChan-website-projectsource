---
title: "Event Implement"
date: 2019-12-25
draft: false
tags: []

## customize page background
# background: static/shader/sandboxShader.glsl

## listout with recommand, new and all pages
# listable: [recommand, new, all]
---

<!--more-->

>--建構、解構--<

public class ClassA
{
//建構子
    public ClassA()
    {
    }

//解構子
    ~ClassA()
    {
    }
}

{
    object obj = new object; <= 建構

} <= 解構(之後都用不到時)


>--實例，工廠與控制中心--<
public class FactoryConsole
{

    public static event Action OperationAllFactory;
    public static event Action StopAllFactory;

    Factory factory001 = new Factory();
    Factory factory002 = new Factory();
    Factory factory003 = new Factory();
    Factory factory004 = new Factory();

    public void StartAllFactory()
    {
        OperationAllFactory.Invoke();
    }
    public void StopAllFactory()
    {
        StopAllFactory.Invoke();
    }
}

public class Factory
{
    bool isOperation = true;

    public Factory()
    {
    //在建構時先把事件註冊好
    FactoryConsole.OperationAllFactory += StartOperation;
    FactoryConsole.StopAllFactory += StopOperation;
    }

    public void StartOperation()
    {
        isOperation = true;
    }
    public void StopOperation()
    {
        isOperation = false;
    }

    ~Factory()
    {
        //在解構時取消註冊所有事件(即使可能取消過了)，以避免Invoke event時可能的錯誤
        FactoryConsole.OperationAllFactory -= StartOperation;
        FactoryConsole.StopAllFactory -= StopOperation;
    }
}

一些細節
GetSet可以直接添加判斷式
private object obj;
public object Obj { get => obj; set { if (value != null) obj = value; } }

transform是 { get; }
transform等同於 GetComponent<Transform>();
所以每禎調用的話會很吃效能

簡寫if(object != null) { object.Function(); }
可以簡寫成 object?.Function();

如果你無法預期一個Coroutine需要執行多久(禎)，但你需要在他執行完後做某件事，你可以丟一個委派當輸入
IEnumerator WaitRandomSecond(System.Action callback)
{
    float duration = UnityEngine.Random.Range(1f, 3f);
    yield return new WaitForSeconds(duration);
    callback?.Invoke();
}

清除event
用迴圈取出已註冊的事件，一個一個取消
foreach(Delegate d in FindClicked.GetInvocationList())
{
    FindClicked -= (FindClickedHandler)d;
}
可以使用 = null 來清除，但不建議