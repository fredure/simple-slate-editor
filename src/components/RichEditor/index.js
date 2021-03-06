import React from 'react'
import {createEditor, Editor, Node, Transforms} from 'slate';

import { Slate, Editable, withReact, ReactEditor } from 'slate-react';
import isUrl from 'is-url';
import './styles.css';

import Toolbar from '../Toolbar';

const Leaf = ({ attributes, children, leaf }) => {
    if (leaf.code) {
        children = <span className="code">{children}</span>
    }
    if (leaf.bold) {
        children = <strong>{children}</strong>
    }
    if (leaf.italic) {
        children = <em>{children}</em>
    }
    if (leaf.underline) {
        children = <u>{children}</u>
    }
    if (leaf.link) {
        children = <a className="link" href={leaf.href}>
            <img className="linkImg" src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAgAAAAIACAYAAAD0eNT6AAAw40lEQVR42u3diY9V9d0/cP+ZAoYtbAElCkaWVIc0QsxIGjANGAIkBY1SI9IgEospbfMARhjjFpQUJWpJq4QtQLWQAI+RgchSH7SoIFZZZ5TF+f743ufHU0uZmbvf8z339Uo+sYVZmHvPnPf7nnvO99wSAICmc4uHAAAUAABAAQAAFADIoatXrxaG2jyuHltQAEABUAAABQAAUAAAAAWAbOvu8G4xf96oz+3tZ+npZyz2a/T0sT/+82K/djV/7u4ex0p+rp6+XjGPRTEf88MPPxT1773Zx5X7uJay/Zf6fYp9PIp5/kABoKEloJxAatTnlvNzlBOAlX5sOf+GSn6maoZSbwWg0Y9tOUWo0f/+Sv/NoADQ8ALQ6M8t5uco91V1Vj621Meiku9fbIGoxWNQys9WjaJY7r+/2o9LKds2KADUpQAU80qx0Z9bys/R28cWe/i3kkCo5IhFsYFRyfcvtwBU8/Eq5d9Q6uNaysfU4nFRAFAAyHQBuNnOtbedYaM+t9ICUMqrxmq9IiznkH0l4VXK96/kCECxby9UUgB6+txyDqlnYdtQAFAAyNxRgGL+dxY+VwFQAOpVACrd5hQAFAAyXwB+fAZ2dzvarHxuSgWgWF1dXTUpAJU8BpX+XLUsANUovI4AoACgABR5ZnNWPreS8Kv3OQCx4JTzPNTyHICUCkB3H1vs41puiXIOAAoAudfTK8/eAqlRn1tsUNfqTO9SPracM9treRXA9b+7HqDVugrgxq9b7ce2WoGahW1DAUABIJNHAYrdeTXic8u5rKwW13qX83OU+l55rdcBKPeVbqU/VzHFolrPWbXWZ6jFtqEAoACQqQJQ6t/V+3Mr2flWeyXAUnfyKawEWM2fq5zHq9orAVZjJcFSy5YCgAIA1LWoAQoAoAAACgCgAAAKAKAAAAoAAKAAAAAKAACgAAAACgAAoAAAAAoAAKAAAAAKAACgAAAACgAAoAAAAAoAAKAAAIACAAAoAACAAgAAKAAAgAIAACgAAIACAAAoAACAAgAAKAAAgAIAACgAAInq6uoKJ0+eDHv27AlvvvlmWLFyRVi4cGF46KGHwpQpU8KECRPC7bffHoYMGRJuvfXW0KdPn/CTn/wk9O3bN/Tv3z8MHTo0jB49OkycODG0traG2bNnh0WLFoVVq1aFt99+O+zbtzecPn3aA40CANAoV65cDu3t7WHdunWFkJ88eXIYNGhQIdBrPbEoPPDAA2Hx4sVhw4YN4ciRI+GHH37wpKAAAFTb1atXwv79+8PKlSvDtGnTwsCBA+sS9sVOPKowY8aM0NbWFg4ePKgQoAAAlOvs2bPhnXfeCXPnzi286s5S4Pc2o0aNCgsWLAibNm0KnZ0dnkwFAICedHRcLIT+zJkzC+/TpxT63U08WjFv3i/Dli2bw6VLlzzJCgAA18XD+/EVc9YO7Vd7hg0bFpYsWRIOHz7sSVcAAJrTd999F/64/o+hpaUl16Hf3cQTCf/85z8Xzm9AAQDIvbNnzxRO5hsxYkRTBv+Nc+edd4aXX3752rkCnTYOBQAgf86c+TYsX748DB48WPDfZGIhilcROGlQAQDIhXhiX3zFL/iLm5EjR4a1a9cW1jpAAQBITrwWPi6Uc9tttwn2MmbcuHFh69atNiQFACAdcZW+uDqfIK98ZsycET799FMblQIAkF3xcP/TTz9dWF9feFdv4r0Knl/9vLcFFACA7Ik34Rk7dqzAruFMmjQpfPzxxzY2BQCg8eLqdkuXLv2/u+uZ2k5cIXHNmjXuN6AAADTOJ5/8vWkX8mn0xJsiffXVKRuhAgBQXxs3bqzbLXhN95cMfvDBBzZGBQCg9uLStfFEPwGcjYknXMYFhLq6umycCgBAbcRb9E6fPl3wZnAefexRdxtUAACq78SJE2HChAnCNsPT2tpaWHIZBQCgKg4ePBhuH327kE1gxo8fXyhrKAAAFYnX91vHP625/fbbw9GjR228CgBAeXbt2hUGDBggVBO9u+ChQ4dsxAoAQGm2b99eWHRGmKY7w0cMv3ZfhgM2ZgUAQPgrASgAAMJfCUABABD++Z2hQ4cqAQoAgPBXAlAAAOEv/JUAFABA+BslAAUAEP5GCUABAIS/UQJQAADhb5QAFABA+BslAAUAEP5GCVAAAIS/UQIUAADhb5QABQBA+BslQAEAEP5GCVAAAIS/UQIUAADhb5QABQBA+BslQAEAhL/QMkqAAgAIf2OUAAUAEP7GKAEKACD8jVECFABA+BtTxAwfMTwcPHjQL6ECAAh/02wzYsSIcPToUb+MCgAg/LM1AwcODD//+c/DsmXLwoYNG8LevXvDP/7xj3Du3Llw9eqVwmN55crlcPbsmXD8+PGwe/fusH79+vD000+H1tZWj3ERM3r06PD555/7pVQAAOHf+EBaunRpIcwvXbpU0WPd2dlReLwXLlxYeLXr8b35jB8/Ppw5861fTgUAEP71nT59+oSHHnoo7Nq169or+6s1eewvX74U3nvvvTB16lSP+U0mHjH5/vvv/ZIqAIDwr8/MmzcvHDt2rK7PxYcffhgefPBBj/8N88gjj4Suri6/rAoAIPxrN/fdd1/46KOPGvq87Ny5M4wbN87z8aNpa2vzC6sAAMK/+tO/f//w4ksv1uxQf6niYe9nn3228DaE5+cnoW/fvuFvf/tAAbDrAoR/9Sa+2j58+HAmn6t40uGoUaM8T9dm5MiR4auvTikAAMK/8onvucfL97Ls5MmTYdKkSZ6vazNt2rTwww8/KAAAwr+yk8vi9fop6Oi4WAg/z9tPwurVqxUAAOFf3jzxxBPJvZKM5wXMmDGj6Z+7uB1//PHHCgCA8C9t4gI8qR5GVgL+d1paWpI5eqMAAMJf+CsBVZznnntOAQAQ/s0R/krAv1+6Ge+1oAAACP+mCH8l4F8zY+YMBQBA+DdP+CsB/5qtW7cqAADCP/2z/ZWA0hdyijdVUgAA4S/4/zf8Fz7RNIvGNHsJeO21tQoA0Jx27Ngh/Js0/JWAnxSWS+7s7FAAAOEv/JtzudhmLgFr1qxRAADhL/ybV7OWgBEjRuT+KIACAAh/4a8E3GRefvllBQDIt3hv9LgQiuAX/krAv+bOO+8MV69eUQCAfNq3b28YOHCg4Bf+SsBN5i9/+bMCAOTPkSNHwtChQwW/8FcCupkHHnhAAQDy5csvvwyjR48W/MJfCehlDh8+rAAA+dDRcTHce++9gl/4KwFFzJIlSxQAIH0x6GbPni34hb8SUOQMGzYsXLqUv+WBFQBoMn/4wx8Ev/BXAkqczZs3KwBAuuK1/n369BH+wl8JKHHmzp2rAABp+vzzz8Pw4cOFv/BXAsqYeKls3lYGVACgCVy9erVwOZPwF/5KQPmzadMmBQBIy/Ornxf+wl8JqHAee+wxBQBIx6FDh0K/fv2Ev/Cvm++++y5MmzYtd9vQyJEjc7UNKQCQY3Ed85/97GfCX/jX3cWLF8KkSZNyty21tx9QAIDsW716tfAX/g1z6tSpMGrUqFxtT21tbQoAkG3xrP9mv8mP8G+83bt35+rS03h+gwIAZFqzr/Yn/LPj2Wefzc12NWTIkNxsVwoA5ND7778v/IV/ZsQrA8aPH5+b7SveRVMBADInBl9LS4vwJ1N27dqVm21sw4YNCgCQPW+99ZbwJ5MefPDBXGxnixcvVgCAbLly5XIYO3as8CeTPvzww1xsa3FVTQUAyJT169cLfzJt6tSpyW9vw0cMVwCA7IiL/owZM0b4k2nvvfdeLra7r7/+WgEAsmHjxo3Cn8y7fPlSLu5KuW/fXgUAaLyurq5cLrsq/PNp4cKFyW9/b7/9tgIANN6ePXuEP8nYsWNH8tvgqlWrFACg8ebN+6XwJxmdnR3h1ltvTXo7XLRoUaYf46tXr1anAMQvVMwA9Xf69Ommud2v8M+P+++/P+ltMS61nbXALzWTbynniyoAkB3x7mTCn9QsWbIk6e2xtbW1oY9fPO+n0kwuugAA2TRx4kThT3JSX7Mi/t5l5ZV+uTmtAEDC2tsPCH+SFG8TnPJ2OXr06EwUgEp+NxQASFiebrMq/JvL8ePHk942hw4d2rDHrlpHARQASFR8DzDP6/4L/3w7e/Zs0ttnvIohC2p6DkBv38BJgNAYhw4dEv4kK964KuVttG/fvpl7TBUAaBJxIRLhT8pS31ZzfwTAZYCQTalfRy38m1u8eZUjAPUP/bIKAJAd58+fL+yAhD8pb8POAahO+JdLAYAEbdu2TfiTtBMnTiS9zQ4ZMiTpV/8KACTqmWeeEf4kbe/evUlvt7fddltDH79qvC1f0jkAQDZMmTJF+JO0DRs2JL3tTpgwIVOPp5MAoQlcunQp+TupCX+WLVuW9PYbS3hWKQCQUwcOfCT8Sd7UqVOT3oYfeuihTD++VVsHAMiON95YL/xJ/ijWwIED096On3gik6/6q74QEJAdKd9GVfgTpX4joDgrVqxo6GNYl9sB99QuHPqH+ps2bZrwJ2lLly5NvgC8+eabmXmlX7PLAHv7hkoA1Ncdd9wh/ElWzIt4K93UC8CePXsyUQDqcjvgmwW9EgD11dnZKfxJ2q5du3JxCevJkycbWqIysxSwAgD1cezYMeFfdFnqKDxe8f3mLVs2h7/85c+F2bp1a9i3b2/49NNPw+XLl2xUdRbPnk89/AcPHlx4Dz4rR1RqvhCQAgCN9/777wv/m4jfp739QFizZk2YPWd20W+T9OnTJ4wfPz7MmzcvvPLKK+HIkSOZ2bHntcDGxzz1ApDVNQAUAMixVFZPq1f4x9CPV0XcfvvtVfu3jxkzprBITSwDVNf8+fNzcfh/4cKFmQ19BQByqq2trenDP37t9957L0yePLnmP0tra2vYtGmTcxiq4KOPPspF+MdZt25dsqFfVgG48Ru4EgDq79lnn23q8I8nkLW0tNT95/rpT39aOHeA8gPrvvvuy00BaG9vz1T4l8tlgJCQuPpYM4b/6dOnw9y5cxv+M06fPj0cP37chliiF196MTfhH1cwvHLlcvKv/osuALVoHkDpsvoeai3DP77yHjFiRGZ+1gEDBoRXX33VyYJF+vjjj0P//v1zUwDiQlxZOapSt5UAgcabNWtW04R//Jq///3vMxsE8WqD8+fP2yh7cO7cuTBu3LjchH+clStXZvKxrstSwL39GVA7Dz74YFOEf7w+f978eZkPg4kTJ4YTJ07YMG8iHiaPb5nkKfzjxDUksq6qBaCYlQCB2svSDrVW4f/dd9+FGTNnJBMIt4++3SWDNzl68/DDD+cu/IcMGXIt764k8RxU9TLA7r6YEgDNVwBqGf5ZO8pRzAwfPlwJ+FH4x+0jb+EfZ968X2b+Vb91AEABEP4NOBLwj3/8Q/jnNPzjvPPOO5l5rOtyO2AFALJj5syZwj/DM2HChMKJb8I/f9OvX79w9uzZTL7Sr9llgAoAZEcjr4UX/sVfHdBslwjmPfzjzJgxIxOPdcNuB1zO3wPVs2DBAuGfwMR1AoR/vubtt9/OzGNet6WAe/tmwh/qZ+nSpcI/gYmLBcXbDQv//Kz+19FxMZPPQV0WAhL+0HhxERLhn8bEn0/452PikbcUWAkQcuz1118X/glNXm8g1EzhH2f//v3JhL4CADm1ZcsW4Z/Q3HPPPbm7lXCzhX+8+2SeQl8BgES1tx8Q/onNpk2bhH/Cs379+syHf7luqeY/CKitb775RvgnNq2trcI/0Yl3oYzbbh5f/SsAkKC4HrnwT2tSXya4GcM/zooVKzL7nLgdMDSh+6bcJ/wTm2XLlgn/xGbw4MHXVv47k8zzpABAE3hswWPCP7EZM2aM8E9slv9uebL7iJqvA1DqNwKqo62tTfgnOEePHhX+Cb36P3Pm26TDvRhlrwSoAEBj7Nq1S/gnOK+88orwT2RWrVqV/Kv7qhSAG0P/Zt9cCYD6ia9MhH+K95KfJ/wTmNtuuy10dnYoADf7ZgoANN7dd98t/BOb8ePHC/8EZsOGDU2zH1EAIEGPPvao8E9s+vbtGy5fviT8MzyTJ0/O3cqNCgDkTFydTPinN8ePHxf+GS5o7e3tTbUfqegcgLjRuCsg1F8MEuGf3uzdu1f4Z3TirbZTUMwCQMWerH9Ltb4hUF9j7xor/N0dUPhXaZ2Gjo6LCkA53xSov0WLFgn/xOYvf/mz8M/g7N69uyn3IVYChERt27ZN+CsAwr9JDv03vADc7OQ/oDFiEA8aNEj4JzRbtmwW/hmalpaW8P333yf5+1+No/IlnwNQzJ8D9TFv/jzh71Cz8C9jYnn+5JO/5y78S8nkW0r9RsX+HVB77777rvBPaI4dOyb8MzIbN25MPvzL+fuyCkClHwPU5m2AIUOGCP9EplFLzAr//LzvX81MVgAgcU8++aTwT2DuvPNO4Z+BmT59+rW8uqIAKACQvtOnTwv/BGb2nNnCv8EzYcKEcPbs2aR/3xUAoKaEf/VnzZo1wr+BM2rUqHDixInkfzfreg7Ajcv9djfNdAMFEP6m1Dlw4CPh36AZPHhwrtb5r9aVeZYCBoR/He4xX68XScL/32fAgAFhz549uftdrcaN+W4p5xsKfhD+pvh56qmnhH8D5tZbbw27du3yy12NAgAIf1P6tLcfEP4NCP/t27fn+ve20hflFR8BcDQAhL/pfiZPniz8hX/Ng78mKwEW+80UABD+5j/nvffeE/7CP80CUM69hwHhb34S7r333pqe/Cf8mzf8i8nsqhUAQPib0mbnzp3CX/jXtQCUktsKAAh/U4OZM2eO8Bf+CgAg/Jtphg8fXliiWfgL/6QLwI9XAgSEv+l9tm7dKvyFf00LQF1vB+wkQBD+pvdZvny58Bf+dSsBrgIAhH8GZt68X9bkrH/hL/xLyeZiWQkQhL+pwsyYOSNcvnxJ+Av/ZCgAIPxNhRMf5/h4C3/hn8sC0N0hhusnCQLCX/gLf+FfW9V8W77spYBv/DtA+At/4S/8c1QAbvxi1bgHMSD8hb/wF/61KwhVeQugmFf8CgAIf+Ev/IV/WiVAAQDhb4S/8FcAFAAQ/kb4C38FIPR+DoCFgED4C3/hL/zrG+4NvQrAKoAg/IW/8Bf+OS8AvX1TQPgLf+Ev/LNRAIplJUAQ/kb4C/8mpACA8DfCX/grAD2f5Oc8ABD+wl/4C/9svxWgAIDwN8Jf+DdZ+Fe0EqACAMJf+At/4Z/98I/b1Y25XZOrAADhL/yFv/DPRgEo5oV7xQXAq3sQ/sJf+At/BQAQ/sJf+At/BQAQ/sJf+Av/rBSAqp4D4CRAEP7CX/gL/+yWgKpdBaAAgPAX/sJf+KdbAIqlAIDwF/7CX/g3IZcB0hBdXV3hn//8Zzh48GDYtm1bePPNN0NbW1tY/rvlYcmSJYUd6cMPPxzmz58f5s2bV/jfv/rVr8Kvf/3rsGzZsrB69eqwbt26sHnz5vDhhx+GkydPJltChb/wF/6U8uq/Wh9X9t0Af7zhe/VPT0H/6aefhk2bNoUVK1eEuXPnhkmTJoVBgwbVZKczYcKE8NBDD4XfLv9teOedd8Lhw4evbZ9XhL8R/sI/V4f/u8vdqi8E1NPhfof/+bHLly+Fffv2hlWrVoWZM2eG4cOHN3yHNHDgwDB16tRCKdi5c2e4ePGC8Bf+wl/4J18A4sQXWb29UC+7ANz4xYq5BpHm8vnnn4fXXlsbZsycUQjbrO+k+vbtG1pbW8Pzq58Phw4d+rdfIOEv/IW/8E+xCNT0JMCewl4BaD7Hj/9PeO6550JLS0vyO64xY8aE3/zmN4VzCepRBoS/8Bf+1KoElEIBoGjnzp0rnHg3ZcqU3O7Ixo8fX3j74sKF2rxNIPyFv/DHEQCSEc/Uf/zxx5M4vF+NiTv363fZymn4d91khL/wF/4JBn+xf1dRAejuHADrAORT3NFt3bq18F55M+3QmiT8S/lz4S/8hX9GC0A5f19SAejtUIPwz9/GtXHjxjBx4sSm26E1Qfj/OOhvfPXfJfyFv/BPYx9drY8rex0A4Z8v8eS3d999tymDv4nCP/QQ+F3CX/gL/+ZiJUAK1+3n+cQ+4Z//IwDCX/ijAFCCr746VVhqt5l3aE0W/rk8B0D4C/+8H/Ivd7wFwE2fy5dffjkMHjxY+DdX+OfuKgDhX5/p37+/8G/WAuAkwPw4evRoUx/uF/4u9RP+pS+l/cEHH9h5ZqwQVPoxRRWAal5zSOPEndoLL7xQOIwn/HMd/jd7T7+n9/17+rOQ1SMFwr8+M3To0LB371470GYvANX4ZjTGqVOnwvTp0+3Qmus6/5ud4NfTmf9dvfzXK/8mm9GjR4cjR47YgSoACkCq3n///TBixAg7tOa+zr/UAtDVw/kCwr8JJt7j44svvrADVQAUgFQP+a9cuTL06dPHDq25r/PvqvAIQGauFBD+9ZnZc2aHjo6LdqIZLwB1XQpYAUhHZ2dHmDt3rp2Z6/zLPQcgZO0cAOFf+4kvFn7/+9/X5HeF2paAck/Mv6Ua38iVAdlx8uTJXNyiV/gb4V+/GT58eNixY4cdaE5KQLEUgByJl/jdcccddmjCv5z37zO5NLDwr/1MnTrV+/1NykqAObF///4wfMRwOzThX26IZ64ACP/aTr9+/cLzq5/3Yk0BIGW79+wuLNYh+IV/kZcElnr9v/DP2fzsZz8Lhw4dsvP0FkDv36TYfwz1t3PnjjBgwADBL/x7e1XfVeF/hX9OVvVbvXr1tf31FTvPnIZ/zU4CLOfvqZ140o6V/YR/iecAFHO2f8MKgPCv4eV9s2eHzz//3I4zR+F/45+VmsmWAhb+wj+f4e9sf+H/f4v6xAXByFcB6OnP3A1Q+At/4S/8mzj8x44dGzZs2OC6fgWg8gLQXQlA+At/I/yzM2PGjAnr168PV65ctsNUABwBEP7CX/gL/7zPpEmTwsaNG53g1+QFoC7nAHR1dSkCdbR9+3bhL/yFv/D/j2v547Lfe/bsKeyTac4S4CoA4S/8hX/Th390+vTpsHDhwsK97PP6+E2cOLFwOd9XX52yg2zSAvDjfaB1AIS/8Bf+TR/+Nz6n7777bpg375e5WCgrvre/bNmy0N5+wI6RqrASoPAX/sI/d+F/o87OzrBt27awaNGiMPausUk8Vn379g33339/WLVqVWHVPof46e5wf7nn55V9EmB370Ug/IW/yVL438ynn34a3nhjfXj0sUfD3XffnYnHJ/6+T5kyJTzzzDOF3//z58/bEdL4AtDTF1YAhL/wNymF/818++0315bV3hna2trCYwseC/fdd19NzyEYPXp0mDZtWliyZEmhiBw48FG4dOmSnR/ZKgA3frFirkFE+At/k0r491YM4nvuW7ZsCa+//npYsWJFePrpp8Njjz1WOPt+5syZhSCPM3369MLPOmvWrDB//vzwxBNPhGeffTasWbOmsCDPX//613Ds2LFrb0d02NFRl5JQtQLQ0xdWAIS/8Dd5C39QABQA4S/8jfAHBUABEP7C3wh/SF9F5wDEnbSFgIS/8DfCH+r76r6UkwC7y+hbqvUNEf7C3wh/yFkB6O2bIvyFvxH+kNMCgPAX/kb4Q34oAMJf+BvhDwpAZYcdEP7CX/gDjX0roGoFoJrLDgp/4S/8hT9Qu/AvJY8VAOEv/I3whwTD/8Y/6+7vKy4ACH/hb4Q/ZKMA9PRnCoDwF/5G+IMCoAAIf+FvhD8oACUUACVA+At/I/whjQJQk3MAnAQo/IW/8AeyVwJcBSD8hb8R/tAkBeDH+9aarQOA8Bf+wh/IHwVA+At/I/xBAej5kIND/8Jf+At/oHGq+bb8LdX6hsLfCH/hD+SoAPT2xZq1BAj/+oT/999/L/yFP1BiQShmf1yVhYCarQAI//qE/9WrV8KsWbM8xsIfKKMEKADCP8nwjxYtWuQxFv6AAiD8myn8161b5zEW/kAWCkBPX6wZCoDwr1/4HzlyxGMt/IFeMtlVAMI/V+Ef3/efNGmSx1n4AxUUgGIoAMI/M+EfvfjSix5n4Q+UmceluKXSb+yVv/Cvlm+//SYMGTLEYy38gTqwFLDwz0T4R7/5zW881sIfqNOL8pKXAu7tz4S/8C/H2bNnwqBBgzzewh8oI/jrcg5AMX8u/IV/qV544QWPt/AHehH3x8UUgKquBNgMSwEL/8aEfzRhwgSPufAHyjgaX87HlFQAqvHNsmzXrl3Cv0Hh397e7jEX/oACUH+7d+8OAwYMEBoNCP/oD3/4g8dd+AMKQH21tx8IgwcPFhoNCv9oypQpHnvhD2S1AOTxHIDPPvssjBw5Umg0MPw7OztC3759Pf7CHyihAPR2Yr6lgHsQLzsbN26c0Ghg+Ef79+/3+Gc8/ON2cf78eXteyGAJqOQF+S3lfMPUw//Klcth2rRpQqPB4R/9cf0fPQcZD/+4faxatcpeFzJYBHr6/1UrAHmyePFioZGB8I+WLVvmech4+MfvMX78+NDV1WWPCznSdAXg7bffFhoZCf/okUce8VxkPPyvz4cffmiPCRl69V/pUflbuvuixXyT1N4KOHr0aBg4cKDgyEj4RzNmzvB8JBD+ceK9GoBsh39F5wDktQDEHeXEiRMFR4bCP3rggQc8JwmEf5wxY8Z4GwAyFP7X9+M/zuCqXwWQB4uf8r5/1sI/am1t9bwkEP7X59ChQ/bAkIECUMwLdwUg/O8yv4Ije+EfuRojnfCP8/zq5+2BQQFIQ7x+efTo0cI/g+EfPfTQQ4I9kfCPE4/YAApAyd+sEZ588knhn9Hwj4oNHuHf+PCPE1dtvHjxgr0wZLQA1P0cgKwWAKvMZTv8o5UrVwr4RML/+uzcucNeGDJUAqp2FUBeCsDVq1dCS0uL8M9w+EcbN24U8gmFf5zfLv+tPTBkuAAUqyp3A8yi1157TfhnPPyjuDaDoE8n/ONMnTrVHhhyoKS7AaZSBs6dOxdGjBgh/BNpsm7HnE74x4mLaaV6+2+gwgKQ9UKw/HfLhX9CZs6cKfQTCf/rc+TIEXtPaNCLpmrl7i3lfvOsFoHTp0+HAQMGCP+EvPrqq4I/ofCP86c//cmeGJqtAPRUBLJgyZIlwj8xX3zxhfBPKPydCAj5UFIBSOHVf//+/YV/gpr9ngAphX+cuIATkPMCkNJ7/814b/k8hH/01ltvCf9Ewj/OhAkT7D2h2QpAVsUlf5vtbPK8hH/0/fffh1GjRgn/BMI/zq233upKAGigarw4z80RgJdeelH4J2716tXCP4Hwvz4nT560F4aMhX/NVgLMahmIO7y77rpL+Ceuo+NiGDlypPBPIPzjfPTRR/bE0MDwL+fvyy4AN+5oslICdu7cKfxzYt26dcI/gfCPs3nzZntjaFABqPRjyioAWTwKMHfuXOGfo4178uTJwj/j4R/nj+v/aG8MeS4Avb3P0NXV1dAH49tvvwn9+vUT/jkSV5mLJ5kJ/+yGf5x4zgbQZAUgS157ba3wz6FXXnlF+Gc4/OM8++yz9sbQoAJQl3MAsn6pT2trq/DPoXhkad68Xwr/jIZ/nMWLF9sbQ4ZKQNWvAsjy9f/xMiThn1+dnZ3Jnw+Q1/CP8/jjj9sTQ4NLQCV5nfRbAGvXrhX+OffPf/6zsOqc8M9W+Md5+OGH7YUhYUnfDjjuYIV//p06dSq5EpD38I8zf/58Gydk4ChAuXmc7GWAcdGYPJ4p/sgjjwj/bo4EpPJ2wKxZswpLG+c5/BUAyFbw13wlwGo2j0pt3749d+H/i1/84trjeMXW3Y14TsC8efMy/RwuWrSoJs9h1sL/elkFsvGqv5xMTnYp4KVLl+Yq/OMh7gsXLti6exGvDoiXCGbt6E/899RqYZwshv/1t6qAxhSASj+mqAKQ1fX/J02alJvwHzhwYDh69KgtuwRxsaCsvCUQt8X472mm8I+zZMkSGyI0UwHIgvhKuW/fvrkpAHExI8r7RYivuht1A6EhQ4aEF6/dhfLKlctNF/5xlv9uuY0QHAGor/fffz834f/AAw846a9C8YTQuCxtvYrAoEGDwrJly8I333xTs58p6+Efp62tzcYHeS4AWSwDz69+PhfhH49iHD582BZdJfHM+7feeitMnTq1ZudpvPDCC+Hs2TM1/TlSCP84b775po0OGlQAelsJMLe3A87L3f+spFY7X375ZXj11VfDzJkzC4fqyy1oU6ZMCf+14r/CwYMH6/LvTiX848QrcYDGl4C6XQaYhaMA48aNy8Wr/xMnTtiS6/TLEk+y3LhxY1i5cmUhYOO1+tOmTSvcSyIeMZgxY0bhsrZ4g5t4XsH+/fuvXXbYUdd/Z0rhH+fQoUM2LshgCShWcrcDjqur9enTJ/kCYBEVUg7/OLU8BwKoveTuBfDxxx/n4vB/fIUJqYZ/vHS13uUfaEAByJJNmzblYtEfSDX8r699ANRfMe//V/0ywKyIlx6lXgBWrFxhKybZ8I8TT8QFmqQAZOUtgKeeeir5AuDkKVIOfyUW0igINSkAjSwEc+bMSTr842I1Fv4R/imHf5z4VhyQ7RJQcQEopRDUw/3335/0jjMWGIR/6kexPvvsM08mNFsB6KkI1MPdd9+d9I4zLlmL8E95hg8f7goAaLYCkIW3AeLOJ+Wd57Zt22ydwj/piasrAo0N94adBNjIkwFTvwvgsWPHbMHCP+lZtWqVJxUyXgCKkdTtgC9fvpT8zvPixQu2YOGf9Ozbt9cTC81YABpZBs6fP5/0jvPWW2+19Qr/pCeuABiLOJD9klBxAchSGThz5tukd57Dhg2zZQr/pGfGzBmeXGjGAnDjDq7eJSDefCTlneeoUaNsmcI/6Vm7dq0nGJq1ADTyKIAjAAj/xo5bWEMTFYAs3Q7YOQAI/8ZNS0uLJxkyEu5Ndy+AS5fSvwqgo+OiLVj4JznPPfecJxoSKQDFSO52wKmvA/DJJ3+3BQv/JOf48f/xZEOO3JLaPzi+j57yTnT79u22OuGf3EyZMsWTDQpAY911111J70jXrFljqxP+yc3rr7/uCQcFoLHiK5GUd6Rz58611Qn/pGbAgAHh7NmznnRQABpr9pzZSe9Mbx99uzupCf+k5vHHH/ekgwLQeIsXL05+h3rkyBFbnvBPZtrb2z3xoAA0Xltbm7upIfzrNK2trZ54UACy4d13301+p3rPPffY8oR/ErN161ZPPigA2XDo0KFc7FgPHPjI1if8Mz0TJkwo/OyAApAJnZ2dudi5LliwwNYn/DM9f/rTn2wAoABkS+prAVy/L8CXX35pCxT+mZyJEydmbhVQQAEIc+bMycVO9te//rUtUPhncuK5NoACkDnxLPo87GTjfQ3cG0D4Z3HZX2tVgAKQSTt37szNznbatGl2tsI/U7Nv314bAigA2XTu3LnQp0+f3Oxw33jjDVui8M/EzJ8/34YACkC23XvvvbnZ6Q4ePPjarVaP2xqFf8O3w6++OmVjAAUg25YsWZKrnW9LS8u1Sxw7bJHCv2Hz8ssv2xhAAci+LVu25G4HPHv2bJdeCf+Gnfhn2wMFIAkXLlwI/fr1y92OeOHChU4KFP51X5Pi2LFjNghQANIRz6DP4w45vr2hBAj/es0LL7xggwAFIC3xPcu87pSVAOFfj5k+fbr1/kEBSM/nn3+e652zEiD8azkjRowIp0456x8UgERNnjxZCUD4lzhxHY3333/fRgEKQLry/DaAEiD8azVxOW1AAUja119/XVhTXwlA+Bc3c+fOtS0B6ReAaNasWU2x41YChH+lM2nSJAtOAfkpANu2bWuaHbgSIPzLnTvuuCOcPHnShgHkpwDEFczG3jVWCUD4dzPDRwwPR48etWEA+SoA0Zo1a5pqh64ECP9iZ+DAgWH//v02DCCfBeDs2TNh0KBBSoDwF/4/mgEDBoS//e0DGwaQ3wIQPf300023g1cChH9Pa/zv3LnDhgHkvwB8+eWXhZ2eEiD8hb/wB5qoAERPPvlkU+7wm7kECH/hDygATXsUoFlLgPAX/oAC8H+eeeaZpg2AZioBwv8/w3/HDuEPNHEBOHPm2zB06FAlQPgLf4BmKgDRSy+91NSBkOcSIPyFP6AAdOvKlcth4sSJSkDOSoDwF/6AAtCr3bt3N31AxLUR8lIChL/wBxSAoi1YsEAJyEEJEP7CH1AAShJPCBw1apQSkHAJEP7CH1AAyrJlyxbBkeg5AYXwf0L4C39AASjT448/LkCuTVwpMYZqCq5evRIefexRz5vwBxSA8nV0XAx33323ILk2s2fPDp2dHZl+vi5cuBB+8YtfeL6EP6AAVO7gwYNNu0zwjdPS0hKOHz+eyefp6NGjYfz48Z4n4Q8oANWzbt06ofL/Z/DgweGNN9Zn5ryA+NbE2rVrw8CBAz0/wh9QAKrP+QD/PtOmTQuffPL3hj4nR44cCQ888IDnQ/gDCkDtfP/99+H+++8XMj+avn37hkWLFhXuplhPJ06cCL/61a8K39/zIPwBBaDmvv766zBmzBhhc5PgiYsnHTjwUU0f///+7/8ODz/8sOAX/oACUH/Hjh0Lw4YNEzrdzD333BNWrVpVODxf6XkC8fM//vjjsGLlijBhwgSPbw/hv337dnsmQAGotX379jrprIi57bbbwty5c0NbW1shoOI5A91dSnjx4oVCudq2bVtYvXp1mDNnjtUYhT+gAGTPzp07XB5Y5vTv379wFCUGfPyvx1H4AwpAUrZs2Rz69esnjIzwBxSAZvPee+85Kc0If0ABUAKMEf6AAqAEGCP8AQVACTBG+AMKgBJgjPAHFAAlwBjhDygASoAR/sIfUACUACP8ARQAJcAIfwAFQAkwwh9AAVACjPAHUACUACP8ARQAJcAIfwAFQAkwwh9AAVACjPAHUACUACP8ARQAJcAIf0ABQAkwwh9QAFACjPAHFACUACP8AQUAJUD4AygAKAHCH0AB4D9KQL9+/YSo8AdQAJrNli2bCyEiTNObAQMGhF27dtmIAQWA8uzcuSMMHDhQqCY0gwcPDnv27LHxAgoAldm/f38YNmyYcE1gRo4cGdrbD9hoAQWA6jh27FgYM2aMkM3wjBs3Lnz22Wc2VkABoLq+/vrr0NraKmwzONOmTQtnz56xkQIKALVx6dKl8PjjjwvdDM3ixYvDlSuXbZyAAkDtrVu3zhUCDZ54cuZbb71lYwQUAOqrvb093H333cK4ATNx4sRw5MgRGyGgANAYFy9eCAsWLBDKdZxFixaFzs5OGx+gANB4cdGgUaNGCegazujRo6+ty7DTxgYoAGTLmTPfOhpQw1f958+ft5EBCgDZtXv37sJ71IK78mlpaSksxASAApCEeFnayy+/HIYOHSrIy5gRI0aE119/PVy9esXGBKAApCe+LfDMb55xyWAJN/H57fLfhnPnztl4ABSA9H3xxRfhySefVAS6mf79+4clS5aEr746ZWMBUADy58svvywEnTsM/uvOfcuWLQunT5+2cQAoAPkX161fs2ZNGHvX2KYM/rvuuiu89NKLzuwHUACa09WrV8O2bdvCrFmzQt++fXMd+v369Qtz584tXMv/ww8/ePIBFACieBg8XjkwefLkXAV/vIPi2rVrwzfffONJBlAA6MmJEyeuHSJ/Kfz85z8vvHJOKfDjiY7Tp08Pr776auGcBwAUAMoQ3yffvHlz4eTBe++9N/Tp0ydTgR/fupg0aVJYunRp4e2Mjo6LnjQABYBqi9fIx/fRV61aFebMmVM4oa5eYR/Lx7hx4wrv5T+/+vnw17/+1Yl8AAoAjRLvjnfo0KHw7rvvhra2trB48eIwe/bsMGXKlEJBGDZsWK8nGca/jx8Xb3F8//33F8rFU089Vfh6mzZtCocPHw7fffedBxtAASA1ly9fKrxijysUxpPy4n/j/49/DoACAAAoAACAAgAAKAAAgAIAACgAAIACAAAoAACAAgAAKAAAgAIAAAoAAKAAAAAKAACgAAAACgAAoAAAAAoAAKAAAAAKAACgAAAACgDUw9WrVwtDbR5Xjy0oAKAAKACAAgAAKAAAgAJAtnV3eLeYP2/U5/b2s/T0Mxb7NXr62B//ebFfu5o/d3ePYyU/V09fr5jHopiP+eGHH4r6997s48p9XEvZ/kv9PsU+HsU8f6AA0NASUE4gNepzy/k5ygnASj+2nH9DJT9TNUOptwLQ6Me2nCLU6H9/pf9mUABoeAFo9OcW83OU+6o6Kx9b6mNRyfcvtkDU4jEo5WerRlEs999f7cellG0bFADqUgCKeaXY6M8t5efo7WOLPfxbSSBUcsSi2MCo5PuXWwCq+XiV8m8o9XEt5WNq8bgoACgAZLoA3Gzn2tvOsFGfW2kBKOVVY7VeEZZzyL6S8Crl+1dyBKDYtxcqKQA9fW45h9SzsG0oACgAZO4oQDH/OwufqwAoAPUqAJVucwoACgCZLwA/PgO7ux1tVj43pQJQrK6urpoUgEoeg0p/rloWgGoUXkcAUABQAIo8szkrn1tJ+NX7HIBYcMp5Hmp5DkBKBaC7jy32cS23RDkHAAWA3OvplWdvgdSozy02qGt1pncpH1vOme21vArg+t9dD9BqXQVw49et9mNbrUDNwrahAKAAkMmjAMXuvBrxueVcVlaLa73L+TlKfa+81usAlPtKt9Kfq5hiUa3nrFrrM9Ri21AAUADIVAEo9e/q/bmV7HyrvRJgqTv5FFYCrObPVc7jVe2VAKuxkmCpZUsBQAEA6lrUAAUAUAAABQBQAAAFAFAAAAUAAFAAAAAFAADIqv8HxGkHNcMM97gAAABRdEVYdENvbW1lbnQAQ29weXJpZ2h0IElOQ09SUyBHbWJIICh3d3cuaWNvbmV4cGVyaWVuY2UuY29tKSAtIFVubGljZW5zZWQgcHJldmlldyBpbWFnZbaaaaYAAAA4dEVYdENvcHlyaWdodABDb3B5cmlnaHQgSU5DT1JTIEdtYkggKHd3dy5pY29uZXhwZXJpZW5jZS5jb20pTs6ZTgAAACV0RVh0VGl0bGUAbGluayBpY29uIGJ5IGljb25leHBlcmllbmNlLmNvbb3rlacAAABaelRYdENvbW1lbnQAAHicc84vqCzKTM8oUfD0c/YPClZwz03yUNAoLy/Xy0zOz0utKEgtykzNS07VS87P1VTQVQjNy8lMTs0rTk1RKChKLctMLVfIzE1MTwUAuI8aJJy8mOMAAABBelRYdENvcHlyaWdodAAAeJxzzi+oLMpMzyhR8PRz9g8KVnDPTfJQ0CgvL9fLTM7PS60oSC3KTM1LTtVLzs/VBAB9NhBoHN3mjwAAACp6VFh0VGl0bGUAAHicy8nMy1bITM7PU0iqBNOpFQWpRZmpecmpesn5uQC6mgvR8G8qrgAAAABJRU5ErkJggg==" />
            <span className="linkTitle">{children}</span>
        </a>
    }
    if (leaf.color) {
        children = <span style={{color: leaf.color}}>{children}</span>
    }
    if (leaf.background) {
        children = <span style={{backgroundColor: leaf.background}}>{children}</span>
    }

    return <span {...attributes}>{children}</span>
}

const Element = ({ attributes, children, element}) => {
    if (element.type === 'link') {
        return <a className="link" href={element.url}>
            <span className="linkTitle">{children}</span>
        </a>
    }
    return <span {...attributes}>{children}</span>
}

const withLinks = editor => {
    const { isInline } = editor;

    editor.isInline = element => {
        return element.type === 'link' ? true : isInline(element);
    }

    return editor;
}

class App extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            value: [{
                children: [{
                    text: ''
                }]
            }]
        };

        this.id = this.props.id;

        this.onChangeCallback = (value) => {
            this.setState({value});
        }

        this.Editor = Editor;

        this.editor = withLinks(withReact(createEditor()));
        this.renderLeaf = props => <Leaf {...props} />;
        this.renderElement = props => <Element {...props} />;
    }

    componentDidMount() {
        ReactEditor.focus(this.editor);
    }

    serialize = value => {
        return (
            value
                .map (n => Node.string (n))
                .join ('\n')
        );
    };

    deserialize = string => {
    return string.split ('\n').map (line => {
        return {
            children: [{text: line}],
        };
    });
    };


    insertLink = (href) => {
        if (window.getSelection().isCollapsed) {
            Transforms.insertNodes(this.editor, {
                type: 'link',
                children: [{text: href}],
                url: href
            });
        } else {
            const selectedText = window.getSelection().toString();
            Transforms.insertNodes(this.editor, {
                type: 'link',
                children: [{text: selectedText}],
                url: href
            });
        }
    }

    onKeyDownCallback = (event) => {
        this.props.onKeyDownHandler && this.props.onKeyDownHandler(event);
    }

    onPasteCallback = (event) => {
        const text = event.clipboardData.getData('text');
        if (!isUrl(text)) return null;

        event.preventDefault();
        return this.insertLink(text)
    }

    onFocusCallback = () => {
        this.props.onFocusCallback && this.props.onFocusCallback({
            instance: this.editor,
            id: this.id,
            value: this.serialize(this.state.value)
        });
    }

    render() {
        return (
            <Slate
                editor={this.editor}
                value={this.state.value}
                onChange={this.onChangeCallback}
            >
                {this.props.toolbarVisibility && <Toolbar editor={this.editor} />}
                <Editable
                    style={{minHeight: this.props.height}}
                    className="editor"
                    spellCheck
                    onKeyDown={this.onKeyDownCallback}
                    onPaste={this.onPasteCallback}
                    onFocus={this.onFocusCallback}
                    renderLeaf={this.renderLeaf}
                    renderElement={this.renderElement}
                />
            </Slate>
        )
    }
}

App.defaultProps = {
    toolbarVisibility: true,
    height: '300px',
};

export default App;
