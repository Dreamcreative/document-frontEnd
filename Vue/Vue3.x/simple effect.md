# simple-effect

1. watchEffect((onCleanup)=> void, options) - 相当于 watch 的 pre 参数
2. watchPostEffect((onCleanup)=> void, options) - 相当于 watch 的 post 参数
3. watchSyncEffect((onCleanup)=> void, options) - 相当于 watch 的 sync 参数
4. watch(source, (value, oldValue, onCleanup)=> any, options)

* 返回一个用来停止该副作用的函数

## 有什么区别

1. watch
   1. 需要明确指定监听的响应数据源
   2. 可以访问被监听数据的新值和旧值
   3. 默认是懒执行，只在数据源变化后执行回调
   4. 可以通过选择配置行为
2. watchEffect
   1. 默认在组件更新前执行(flush=pre)
   2. 自动追踪依赖，不需要明确的监听源
   3. 立即执行，并在依赖变化时重新执行
   4. 无法直接获取变化前的旧值
3. watchPostEffect
   1. watchEffect (flush=post) 的别名
   2. 在组件更新后异步执行，使用 `Promise.then()`
   3. 适用于需要访问更新后的 DOM 的场景
4. watchSyncEffect
   1. watchEffect (flush=sync) 的别名
   2. 同步执行，依赖变化后立即执行

## 重点

最终会调用 [watch](./watch.md)

```ts
// 调试相关
interface DebuggerOptions {
  onTrack?: (event: DebuggerEvent) => void
  onTrigger?: (event: DebuggerEvent) => void
}
// watchEffect 配置
interface WatchEffectOptions extends DebuggerOptions {
  flush?: 'pre' | 'post' | 'sync'
}
// watch 配置
interface WatchOptions<Immediate = boolean> extends WatchEffectOptions {
  immediate?: Immediate
  deep?: boolean | number
  once?: boolean
}
function watchEffect(
  effect: WatchEffect,
  options?: WatchEffectOptions,
): WatchHandle {
  return doWatch(effect, null, options)
}
function watchPostEffect(
  effect: WatchEffect,
  options?: DebuggerOptions,
): WatchHandle {
  return doWatch(
    effect,
    null,
    __DEV__ ? extend({}, options as any, { flush: 'post' }) : { flush: 'post' },
  )
}

function watchSyncEffect(
  effect: WatchEffect,
  options?: DebuggerOptions,
): WatchHandle {
  return doWatch(
    effect,
    null,
    __DEV__ ? extend({}, options as any, { flush: 'sync' }) : { flush: 'sync' },
  )
}

function watch<T = any, Immediate extends Readonly<boolean> = false>(
  source: T | WatchSource<T>,
  cb: any,
  options?: WatchOptions<Immediate>,
): WatchHandle {
  return doWatch(source as any, cb, options)
}

function doWatch(
  source: WatchSource | WatchSource[] | WatchEffect | object,
  cb: WatchCallback | null,
  options: WatchOptions = EMPTY_OBJ,
): WatchHandle {
  const { immediate, deep, flush, once } = options


  const baseWatchOptions: BaseWatchOptions = extend({}, options)


  // immediate watcher or watchEffect
  const runsImmediately = (cb && immediate) || (!cb && flush !== 'post')
  let ssrCleanup: (() => void)[] | undefined

  const instance = currentInstance
  baseWatchOptions.call = (fn, type, args) =>
    callWithAsyncErrorHandling(fn, instance, type, args)

  // scheduler
  let isPre = false
  if (flush === 'post') {
    baseWatchOptions.scheduler = job => {
      queuePostRenderEffect(job, instance && instance.suspense)
    }
  } else if (flush !== 'sync') {
    // default: 'pre'
    isPre = true
    baseWatchOptions.scheduler = (job, isFirstRun) => {
      if (isFirstRun) {
        job()
      } else {
        queueJob(job)
      }
    }
  }

  baseWatchOptions.augmentJob = (job: SchedulerJob) => {
    // important: mark the job as a watcher callback so that scheduler knows
    // it is allowed to self-trigger (#1727)
    if (cb) {
      job.flags! |= SchedulerJobFlags.ALLOW_RECURSE
    }
    if (isPre) {
      job.flags! |= SchedulerJobFlags.PRE
      if (instance) {
        job.id = instance.uid
        ;(job as SchedulerJob).i = instance
      }
    }
  }

  const watchHandle = baseWatch(source, cb, baseWatchOptions)

  return watchHandle
}

```
