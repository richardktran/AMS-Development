<?php

namespace Tests\Unit\Helper;

use PHPUnit\Framework\TestCase;
use App\Helper\Str;

class StrTest extends TestCase
{
    /**
     * @dataProvider dataProvider
     */
    public function test_standardized_string($expect, $string)
    {
        $this->assertEquals($expect, Str::standardizedString($string));
    }

    public function dataProvider(): array
    {
        return [
            ['', '          ', ],
            ['Lorem', '  Lorem   ' ],
            ['Lorem ipsum', '  Lorem   ipsum   '],
            ['Lorem ipsum dolor', '  Lorem   ipsum   dolor  '],
        ];
    }
}
