# git 操作命令

## 删除所有已合并到远程分支的本地分支

```bash
git branch --merged | egrep -v "(^\*|master|main)" | xargs git branch -d
```

## git stash 将未提交的文件保存到堆栈

```bash
git stash

# 等同于 git stash ，区别是可以添加注释
git stash save

# 列出所有保存的临时提交
git stash list

# 恢复保存的文件
git stash pop
```
