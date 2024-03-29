# javascript解析引擎
javascript解析引擎（简称javascript引擎），是一个程序，是浏览器引擎的一部分。每个浏览器的javascript解析引擎都不一样（因为每个浏览器编写Javascript解析引擎的语言（C或者C++）以及解析原理都不相同）。标准的Javascript解析引擎会按照 ECMAScript文档来实现。虽然每个浏览器的Javascript解析引擎不同，但Javascript的语言性质决定了Javascript关键的渲染原理仍然是动态执行Javascript字符串。只是词法分析、语法分析、变量赋值、字符串拼接的实现方式有所不同。

## 当JavaScript引擎遇到代码是怎么工作的
JavaScript解析引擎就是根据ECMAScript定义的语言标准来动态执行JavaScript字符串。虽然之前说现在很多浏览器不全是按照标准来的，解释机制也不尽相同，但动态解析JS的过程还是分成两个阶段：语法检查阶段和运行阶段。

语法检查包括词法分析和语法分析，运行阶段又包括预解析和运行阶段（V8引擎会将JavaScript字符串编译成二进制代码，此过程应该归到语法检查过程中）。

### 第一阶段：语法检查
语法检查是JavaScript解析器工作的第一阶段，包括 词法分析 和 语法分析，过程大致如下：

#### 一：词法分析
JavaScript解释器先把JavaScript代码（字符串）的字符流按照ECMAScript标准转换为记号流。

#### 二：语法分析
JavaScript语法分析器在经过词法分析后，将记号流按照ECMAScript标准把词法分析所产生的记号生成语法树。

通俗地说就是把从程序中收集的信息存储到数据结构中，每取一个词法记号，就送入语法分析器进行分析。

当语法检查正确无误之后，就可以进入运行阶段了。

### 第二阶段：运行阶段
运行阶段包括预解析阶段和运行阶段。

#### 第一阶段：预解析
第一步：创建执行上下文。JavaScript引擎将语法检查正确后生成的语法树复制到当前执行上下文中。
第二步：属性填充。JavaScript引擎会对语法树当中的变量声明、函数声明以及函数的形参进行属性填充。

预解析阶段创建的执行上下文包括：变量对象、作用域链、this

变量对象（Variable Object）：由var declaration、function declaration（变量声明、函数声明）、arguments（参数）构成。变量对象是以单例形式存在。 作用域链（Scope Chain）：variable object + all parent scopes（变量对象以及所有父级作用域）构成。 this值：（thisValue）：content object。this值在进入上下文阶段就确定了。一旦进入执行代码阶段，this值就不会变了。
“预解析”阶段创建执行上下文之后，还会对变量对象/活动对象（VO/AO）的一些属性填充数值。

函数的形参：执行上下文的变量对象的一个属性，其属性名就是形参的名字，其值就是实参的值；对于没有传递的参数，其值为undefined。 函数声明：执行上下文的变量对象的一个属性，属性名和值都是函数对象创建出来的；如果变量对象已经包含了相同名字的属性，则会替换它的值。 变量声明：执行上下文的变量对象的一个属性，其属性名即为变量名，其值为undefined；如果变量名和已经声明的函数名或者函数的参数名相同，则不会影响已经存在的函数声明的属性。
#### 第二阶段：执行代码

经过“预解析”创建执行上下文之后，就进入执行代码阶段，VO/AO就会重新赋予真实的值，“预解析”阶段赋予的undefined值会被覆盖。

此阶段才是程序真正进入执行阶段，Javascript引擎会一行一行的读取并运行代码。此时那些变量都会重新赋值。

进入了执行代码阶段，在“预解析”阶段所创建的任何东西可能都会改变，不仅仅是VO/AO，this和作用域链也会因为某些语句而改变。