import {
  assertEquals,
  assertInstanceOf,
  assertThrows,
} from "https://deno.land/std@0.205.0/assert/mod.ts";
import {
  filterCommands,
  isJavaScript,
  getCode,
  getConsole,
  getOutput,
  runner,
  getReturn,
  sandBox,
  RunnerError,
} from "./utils.ts";

Deno.test("filterCommands", async (t) => {
  await t.step("return a array", () => {
    assertInstanceOf(filterCommands([]), Array);
  });

  await t.step("filter the commands", () => {
    assertEquals(
      filterCommands(
        [
          {
            command: "start",
            description: "command start",
            type: ["all_private_chats"],
          },
          {
            command: "start",
            description: "command start",
            type: ["all_private_chats"],
          },
          {
            command: "start",
            description: "command start",
            type: ["all_group_chats"],
          },
        ],
        "all_private_chats"
      ),
      [
        {
          command: "start",
          description: "command start",
        },
        {
          command: "start",
          description: "command start",
        },
      ]
    );
  });
});

Deno.test("isJavaScript", async (t) => {
  await t.step("return boolean", () => {
    assertEquals(typeof isJavaScript(""), "boolean");
  });

  await t.step("return values", async (t) => {
    await t.step("js => true", () => {
      assertEquals(isJavaScript("js"), true);
    });

    await t.step("javascript => true", () => {
      assertEquals(isJavaScript("javascript"), true);
    });

    await t.step("empty => false", () => {
      assertEquals(isJavaScript(""), false);
    });

    await t.step("python => false", () => {
      assertEquals(isJavaScript("python"), false);
    });
  });
});

Deno.test("getCode", async (t) => {
  await t.step("type", () => {
    assertEquals(typeof getCode({ offset: 1, length: 1 }, "ada"), "string");
  });

  await t.step("code selection", () => {
    assertEquals(getCode({ offset: 1, length: 1 }, "ada"), "d");
  });

  await t.step("code selection empty", () => {
    assertEquals(getCode({ offset: 0, length: 0 }, "ada"), "");
  });
});

Deno.test("getConsole", async (t) => {
  await t.step("no console", () => {
    assertEquals(getConsole(8), "");
  });

  await t.step("con console", () => {
    assertEquals(getConsole("console.log(8)"), "8");
  });

  await t.step("con error", () => {
    assertEquals("error" in getConsole("console.log(8"), true);
  });
});

Deno.test("getOutput", async (t) => {
  await t.step("con return", () => {
    assertEquals(getOutput("8"), 8);
  });

  await t.step("no return", () => {
    assertEquals(getOutput("console.log(8)"), undefined);
  });

  await t.step("con error", () => {
    assertEquals(getOutput("console.log(8"), undefined);
  });
});

Deno.test("runner", async (t) => {
  await t.step("no return", () => {
    assertEquals(runner(8), undefined);
  });

  await t.step("con return", () => {
    assertEquals(runner("return 8"), 8);
  });

  await t.step("error", () => {
    assertThrows(() => {
      runner("console.log(8");
    }, RunnerError);
  });
});

Deno.test("getReturn", async (t) => {
  await t.step("no return", () => {
    assertEquals(getReturn("const x = 3"), undefined);
  });

  await t.step("con return", () => {
    assertEquals(getReturn("8"), 8);
  });

  await t.step("con error", () => {
    assertEquals(getReturn("console.log(8"), undefined);
  });
});

//evaluate

Deno.test("sandbox", async (t) => {
  await t.step("console", () => {
    assertEquals(
      sandBox(() => {
        console.log(8);
      }),
      "8"
    );
  });

  await t.step("no console", () => {
    assertEquals(
      sandBox(() => {}),
      ""
    );
  });

  await t.step("con error", () => {
    assertThrows(() => {
      sandBox(() => {
        console.log(x);
      });
    }, ReferenceError);
  });
});
