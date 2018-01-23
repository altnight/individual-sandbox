import unittest


class CalcTest(unittest.TestCase):
    def test_calc_subtest(self):
        for i in [2, 3, 4, 5]:
            import ipdb;ipdb.set_trace()
            with self.subTest(i=i):
                self.assertEqual(i % 2, 0)

