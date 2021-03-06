import {assertEquals} from "https://deno.land/std/testing/asserts.ts";
import CacheRepository from "./cache_repository.ts";
import Config from "../config.ts";
import MockRepository from "./mock_repository.ts";

Deno.test('should have a name', () => {
    const repo = getTestRepo()

    assertEquals(repo.name, 'cacheRepo for mockRepo')
})

Deno.test('should list packages from cached repo', () => {
    const repo = getTestRepo()

    const packages = repo.packages
    const packageNames = packages.map(pkg => pkg.name)

    assertEquals(packageNames, ['aPackage', 'anotherPackage'])
})

function getTestRepo() {
    return new CacheRepository(new Config([]), new MockRepository())
}