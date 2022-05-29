<?php

namespace Tests\Unit\Helper;

use App\Helper\Date;
use PHPUnit\Framework\TestCase;

class DateTest extends TestCase
{
    /**
     * @dataProvider dataProvider
     */
    public function test_standardized_format($expect, $date)
    {
        $this->assertEquals($expect, Date::standardizedFormat($date));
    }

    public function dataProvider(): array
    {
        return [
            ['2021-12-31', '2021-12-31T00:00:00.000000Z'],
            ['2021-12-31', '2021-12-31'],
            ['2021-12-31', '31-12-2021'],
        ];
    }
}
