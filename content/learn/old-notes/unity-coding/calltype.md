---
title: "Call Type"
date: 2020-02-23 
draft: false
tags: []

## customize page background
# background: static/shader/sandboxShader.glsl

## listout with recommand, new and all pages
# listable: [recommand, new, all]
---

<!--more-->

在未主動指定傳直、參考的情況下 C# 會自動指定
<!-- value type會自動傳直 -->
<!-- reference type會自動(強制?)傳參考，但string除外 -->

| 正常情況下Function的索引值如果沒有加上ref修飾字就是強制傳值
| 如果傳入的是類別(Class) 則預設就是傳入參考
array, list 的情況比較特殊，寫在筆記的第2部分

=======================================================
    string s = "a";

    PassStringByValue(s);
    void PassStringByValue(string s)
    {
        s = "b";
    }
    Debug.Log(s); 輸出: a

    PassStringByRef(ref s);
    void PassStringByRef(ref string s)
    {
        s = "b";
    }
    Debug.Log(s); 輸出: b

=======================================================
如果傳入的是類別，則預設就是傳入參考

Class c = new Class() { i = 1 };
Debug.Log(c.i); 輸出 => 1

    PassClass(c);
    void PassClass(Class c)
    {
        c.i = 2;
    }
    Debug.Log(c.i); 輸出: 2

    class Class
    {
        public int i;
    }
=======================================================
用法的對比

    call by value -
    intcalValue = 0;
    calValue = Calculate(calValue);
    print(calValue); 輸出: 10

    int Calculate(int value)
    {
        value += 10;
        return value;
    }
//

    call by reference -
    intcalValue = 0;
    Calculate(ref calValue);
    print(calValue); 輸出: 10

    void Calculate(ref int value)
    {
        value += 10;
    }

同樣的結果，如果需要大量調用，call by reference可以防止記憶體堆積

= 換成現實例子 ======

    假如儲存數據的是一張紙(data paper)

    call by value就是我把data paper複印一份(data paper copy)再給對方
    無論對方對data paper copy做了什麼修改，我的data paper都不會被改動

    而call by reference就是直接把data paper交給對方
    對方如果修改，原本的data paper就會被直接改動

接上面運用
    
    如果我需要對方修改後的數據
    
    call by value的話
    我得再把data paper copy抄回data paper
    而這個過程重複執行的話，會多出好幾份複印的data paper copy (記憶體堆積)
    
    call by reference的話
    我的data pape就直接是修改後的數據了
    即使重複執行多次，也不會出現多的data paper copy (防止堆積)

=======================================================

當你使用CallByValue時
記憶體就會產生一個新的位址來存放跟你傳入參數一樣數值的變數供Function使用
int Calculate(int value)
                       ↑J個

一般情況其實不太需要擔心這些問題 因為這些記憶體占用很少
且C#的GC(資源管理工具)也會自動將這些資源釋放掉

而Function裡建立的區域變數當然也會
但通常也不用太擔心這個問題 同樣C#的GC也會自動將不會再使用的資源給釋放

